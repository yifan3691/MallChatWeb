import type { UserInfoType } from '@/services/types'

export const TOKEN_KEY = 'TOKEN'
export const USER_INFO_KEY = 'USER_INFO'
export const SHOW_LOGIN_DIALOG_KEY = 'SHOW_LOGIN_DIALOG'

export const getToken = () => localStorage.getItem(TOKEN_KEY) || ''

export const setToken = (token: string) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
    return
  }
  localStorage.removeItem(TOKEN_KEY)
}

export const getLocalUserInfo = (): Partial<UserInfoType> => {
  try {
    return JSON.parse(localStorage.getItem(USER_INFO_KEY) || '{}')
  } catch (error) {
    return {}
  }
}

export const setLocalUserInfo = (userInfo: Partial<UserInfoType>) => {
  if (Object.keys(userInfo).length) {
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo))
    return
  }
  localStorage.removeItem(USER_INFO_KEY)
}

export const clearLocalAuth = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_INFO_KEY)
}

export const openLoginDialog = () => {
  sessionStorage.setItem(SHOW_LOGIN_DIALOG_KEY, '1')
}

export const consumeLoginDialogFlag = () => {
  const shouldShow = sessionStorage.getItem(SHOW_LOGIN_DIALOG_KEY) === '1'
  shouldShow && sessionStorage.removeItem(SHOW_LOGIN_DIALOG_KEY)
  return shouldShow
}
