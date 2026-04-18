import { createAlova } from 'alova'
import GlobalFetch from 'alova/GlobalFetch'
import VueHook from 'alova/vue'
import { ElMessage } from 'element-plus'
import { clearLocalAuth, getToken as getLocalToken, openLoginDialog } from '@/utils/auth'

function createComputedToken() {
  let tempToken = ''
  return {
    get() {
      if (tempToken) return tempToken
      const token = getLocalToken()
      if (token) {
        tempToken = token
      }
      return tempToken
    },
    clear() {
      tempToken = ''
    },
  }
}

export const computedToken = createComputedToken()

let isHandlingUnauthorized = false

const handleUnauthorized = async () => {
  if (isHandlingUnauthorized) return
  isHandlingUnauthorized = true
  try {
    openLoginDialog()
    clearLocalAuth()
    window.location.replace(import.meta.env.BASE_URL)
  } finally {
    isHandlingUnauthorized = false
  }
}

export const alovaIns = createAlova({
  // 假设我们需要与这个域名的服务器交互
  baseURL: '',

  // 在vue项目下引入VueHook，它可以帮我们用vue的ref函数创建请求相关的，可以被alova管理的状态
  statesHook: VueHook,

  // 请求适配器，这里我们使用fetch请求适配器
  requestAdapter: GlobalFetch(),

  // 设置全局的请求拦截器，与axios相似
  beforeRequest({ config }) {
    config.headers = config.headers || {}
    const token = computedToken.get()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    } else {
      delete config.headers.Authorization
    }
    config.headers['Content-Type'] = 'application/json; charset=utf-8'
  },

  // 响应拦截器，也与axios类似
  responsed: async (response) => {
    const json = await response.json()
    if (response.status === 401) {
      computedToken.clear()
      void handleUnauthorized()
    }
    if (response.status !== 200 || !json.success) {
      // 这边抛出错误时，将会进入请求失败拦截器内
      if (json.errMsg) {
        // 空 token 且 状态码 401 不弹提示
        if (!computedToken.get() && response.status === 401) {
          //
        } else {
          ElMessage.error(json.errMsg)
        }
        throw new Error(json.errMsg)
      } else {
        throw new Error(json.message)
      }
    }
    return json.data
  },
})
