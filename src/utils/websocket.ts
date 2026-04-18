import Router from '@/router'
import { useUserStore } from '@/stores/user'
import { useChatStore } from '@/stores/chat'
import { useGroupStore } from '@/stores/group'
import { useGlobalStore } from '@/stores/global'
import { worker } from './initWorker'
import { WsResponseMessageType } from './wsType'
import type { WsReqMsgContentType, OnStatusChangeType } from './wsType'
import type { MessageType, MarkItemType, RevokedMsgType } from '@/services/types'
import { ChangeTypeEnum, OnlineEnum, RoomTypeEnum } from '@/enums'
import shakeTitle from '@/utils/shakeTitle'
import notify from '@/utils/notification'

class WS {
  #tasks: WsReqMsgContentType[] = []
  #connectReady = false

  constructor() {
    worker.addEventListener('message', this.onWorkerMsg)

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && !this.#connectReady) {
        const userStore = useUserStore()
        userStore.token && this.connect(userStore.token)
      }

      if (!document.hidden) {
        shakeTitle.clear()
      }
    })
  }

  connect = (token?: string) => {
    if (!token) return
    worker.postMessage(`{"type":"initWS","value":"${token}"}`)
  }

  close = () => {
    this.#connectReady = false
    this.#tasks = []
    worker.postMessage('{"type":"closeWS"}')
  }

  onWorkerMsg = (e: MessageEvent<any>) => {
    const params: { type: string; value: unknown } = JSON.parse(e.data)
    switch (params.type) {
      case 'message': {
        this.onMessage(params.value as string)
        break
      }
      case 'open': {
        this.#dealTasks()
        break
      }
      case 'close':
      case 'error': {
        this.#onClose()
        break
      }
    }
  }

  #onClose = () => {
    const userStore = useUserStore()
    this.#connectReady = false
    userStore.wsConnected = false
  }

  #dealTasks = () => {
    const userStore = useUserStore()
    this.#connectReady = true
    userStore.wsConnected = true

    if (!userStore.isSign) {
      this.#tasks = []
      return
    }

    this.#tasks.forEach((task) => {
      this.send(task)
    })
    this.#tasks = []
  }

  #send(msg: WsReqMsgContentType) {
    worker.postMessage(
      `{"type":"message","value":${typeof msg === 'string' ? msg : JSON.stringify(msg)}}`,
    )
  }

  send = (params: WsReqMsgContentType) => {
    if (this.#connectReady) {
      this.#send(params)
    } else {
      this.#tasks.push(params)
    }
  }

  onMessage = (value: string) => {
    const params: { type: WsResponseMessageType; data: unknown } = JSON.parse(value)
    const userStore = useUserStore()
    const chatStore = useChatStore()
    const groupStore = useGroupStore()
    const globalStore = useGlobalStore()

    switch (params.type) {
      case WsResponseMessageType.ReceiveMessage: {
        chatStore.pushMsg(params.data as MessageType)
        break
      }
      case WsResponseMessageType.OnOffLine: {
        const data = params.data as OnStatusChangeType
        groupStore.countInfo.onlineNum = data.onlineNum
        groupStore.batchUpdateUserStatus(data.changeList)
        break
      }
      case WsResponseMessageType.TokenExpired: {
        userStore.logout()
        break
      }
      case WsResponseMessageType.InValidUser: {
        const data = params.data as { uid: number }
        chatStore.filterUser(data.uid)
        groupStore.filterUser(data.uid)
        break
      }
      case WsResponseMessageType.WSMsgMarkItem: {
        const data = params.data as { markList: MarkItemType[] }
        chatStore.updateMarkCount(data.markList)
        break
      }
      case WsResponseMessageType.WSMsgRecall: {
        const { data } = params as { data: RevokedMsgType }
        chatStore.updateRecallStatus(data)
        break
      }
      case WsResponseMessageType.RequestNewFriend: {
        const data = params.data as { uid: number; unreadCount: number }
        globalStore.unReadMark.newFriendUnreadCount += data.unreadCount
        notify({
          name: '新好友',
          text: '您有一个新好友, 快来看看~',
          onClick: () => {
            Router.push('/contact')
          },
        })
        break
      }
      case WsResponseMessageType.NewFriendSession: {
        const data = params.data as {
          roomId: number
          uid: number
          changeType: ChangeTypeEnum
          activeStatus: OnlineEnum
          lastOptTime: number
        }
        if (
          data.roomId === globalStore.currentSession.roomId &&
          globalStore.currentSession.type === RoomTypeEnum.Group
        ) {
          if (data.changeType === ChangeTypeEnum.REMOVE) {
            groupStore.filterUser(data.uid)
          }
        }
        break
      }
      default: {
        break
      }
    }
  }
}

export default new WS()
