import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import apis from '@/services/apis'
import { computedToken } from '@/services/request'
import type { AuthLoginResType, UserInfoType } from '@/services/types'
import { clearLocalAuth, getLocalUserInfo, getToken, openLoginDialog, setLocalUserInfo, setToken } from '@/utils/auth'

export const useUserStore = defineStore('user', () => {
  const token = ref(getToken())
  const userInfo = ref<Partial<UserInfoType>>(getLocalUserInfo())
  const isSign = ref(Boolean(token.value && userInfo.value.uid))
  const isLogin = computed(() => isSign.value)
  const wsConnected = ref(false)

  if (token.value && !userInfo.value.uid) {
    clearLocalAuth()
    token.value = ''
    userInfo.value = {}
    isSign.value = false
  }

  const setLoginState = (data: AuthLoginResType) => {
    const { token: loginToken, ...rest } = data
    token.value = loginToken
    userInfo.value = rest
    isSign.value = true
    setToken(loginToken)
    setLocalUserInfo(rest)
    computedToken.clear()
  }

  const updateUserInfo = (data: Partial<UserInfoType>) => {
    userInfo.value = { ...userInfo.value, ...data }
    isSign.value = Boolean(token.value && userInfo.value.uid)
    userInfo.value.uid && setLocalUserInfo(userInfo.value)
  }

  const clearLoginState = () => {
    token.value = ''
    userInfo.value = {}
    isSign.value = false
    wsConnected.value = false
    clearLocalAuth()
    computedToken.clear()
  }

  const logout = () => {
    openLoginDialog()
    clearLoginState()
    window.location.replace(import.meta.env.BASE_URL)
  }

  function getUserDetailAction() {
    apis
      .getUserDetail()
      .send()
      .then((data) => {
        updateUserInfo(data)
      })
      .catch(() => {
        //
      })
  }

  return {
    token,
    userInfo,
    isSign,
    isLogin,
    wsConnected,
    setLoginState,
    updateUserInfo,
    clearLoginState,
    logout,
    getUserDetailAction,
  }
})
