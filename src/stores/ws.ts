import { ref } from 'vue'
import { defineStore } from 'pinia'

import { consumeLoginDialogFlag } from '@/utils/auth'

export enum AuthMode {
  Login = 'login',
  Register = 'register',
}

export const useWsLoginStore = defineStore('wsLogin', () => {
  const showLogin = ref(consumeLoginDialogFlag())
  const authMode = ref<AuthMode>(AuthMode.Login)

  function openLogin() {
    authMode.value = AuthMode.Login
    showLogin.value = true
  }

  function openRegister() {
    authMode.value = AuthMode.Register
    showLogin.value = true
  }

  function resetLoginState() {
    authMode.value = AuthMode.Login
  }

  return {
    authMode,
    showLogin,
    openLogin,
    openRegister,
    resetLoginState,
  }
})
