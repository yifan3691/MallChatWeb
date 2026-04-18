<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useWsLoginStore, AuthMode } from '@/stores/ws'
import { useUserStore } from '@/stores/user'
import { judgeClient } from '@/utils/detectDevice'
import apis from '@/services/apis'

const client = judgeClient()
const loginStore = useWsLoginStore()
const userStore = useUserStore()

const loginFormRef = ref<FormInstance>()
const registerFormRef = ref<FormInstance>()
const loginLoading = ref(false)
const registerLoading = ref(false)

const loginForm = reactive({
  username: '',
  password: '',
})

const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  nickname: '',
})

const visible = computed({
  get() {
    return loginStore.showLogin
  },
  set(value) {
    loginStore.showLogin = value
  },
})

const activeTab = computed({
  get() {
    return loginStore.authMode
  },
  set(value) {
    loginStore.authMode = value
  },
})

const loginRules: FormRules<typeof loginForm> = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

const registerRules: FormRules<typeof registerForm> = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (!value) {
          callback(new Error('请再次输入密码'))
          return
        }
        if (value !== registerForm.password) {
          callback(new Error('两次输入的密码不一致'))
          return
        }
        callback()
      },
      trigger: 'blur',
    },
  ],
}

const resetFormState = () => {
  loginLoading.value = false
  registerLoading.value = false
  loginFormRef.value?.clearValidate()
  registerFormRef.value?.clearValidate()
}

const switchToLogin = () => {
  activeTab.value = AuthMode.Login
}

const onLogin = async () => {
  const valid = await loginFormRef.value?.validate().catch(() => false)
  if (!valid) return

  loginLoading.value = true
  await apis
    .login({
      username: loginForm.username.trim(),
      password: loginForm.password,
    })
    .send()
    .then((data) => {
      userStore.setLoginState(data)
      loginStore.resetLoginState()
      visible.value = false
      ElMessage.success('登录成功')
      window.location.replace(import.meta.env.BASE_URL)
    })
    .finally(() => {
      loginLoading.value = false
    })
}

const onRegister = async () => {
  const valid = await registerFormRef.value?.validate().catch(() => false)
  if (!valid) return

  registerLoading.value = true
  await apis
    .register({
      username: registerForm.username.trim(),
      password: registerForm.password,
      nickname: registerForm.nickname.trim() || undefined,
    })
    .send()
    .then(() => {
      loginForm.username = registerForm.username.trim()
      loginForm.password = ''
      registerForm.password = ''
      registerForm.confirmPassword = ''
      ElMessage.success('注册成功，请使用账号密码登录')
      switchToLogin()
    })
    .finally(() => {
      registerLoading.value = false
    })
}

watch(visible, (value) => {
  if (value) return
  loginStore.resetLoginState()
  resetFormState()
})
</script>

<template>
  <ElDialog
    class="login-box-modal"
    :width="client === 'PC' ? 420 : '92%'"
    v-model="visible"
    center
  >
    <div class="login-box">
      <img class="login-logo" src="@/assets/logo.jpeg" alt="MallChat" />
      <p class="login-slogan">边聊边买，岂不快哉~</p>

      <ElTabs v-model="activeTab" class="login-tabs" stretch>
        <ElTabPane label="登录" :name="AuthMode.Login">
          <ElForm ref="loginFormRef" :model="loginForm" :rules="loginRules" label-position="top">
            <ElFormItem label="用户名" prop="username">
              <ElInput
                v-model.trim="loginForm.username"
                placeholder="请输入用户名"
                clearable
                maxlength="30"
                @keyup.enter="onLogin"
              />
            </ElFormItem>
            <ElFormItem label="密码" prop="password">
              <ElInput
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                show-password
                maxlength="32"
                @keyup.enter="onLogin"
              />
            </ElFormItem>
            <ElButton class="submit-btn" type="primary" :loading="loginLoading" @click="onLogin">
              登录
            </ElButton>
          </ElForm>
          <p class="form-footer">
            还没有账号？
            <span class="form-footer-link" @click="activeTab = AuthMode.Register">立即注册</span>
          </p>
        </ElTabPane>

        <ElTabPane label="注册" :name="AuthMode.Register">
          <ElForm
            ref="registerFormRef"
            :model="registerForm"
            :rules="registerRules"
            label-position="top"
          >
            <ElFormItem label="用户名" prop="username">
              <ElInput
                v-model.trim="registerForm.username"
                placeholder="请输入用户名"
                clearable
                maxlength="30"
              />
            </ElFormItem>
            <ElFormItem label="密码" prop="password">
              <ElInput
                v-model="registerForm.password"
                type="password"
                placeholder="请输入密码"
                show-password
                maxlength="32"
              />
            </ElFormItem>
            <ElFormItem label="确认密码" prop="confirmPassword">
              <ElInput
                v-model="registerForm.confirmPassword"
                type="password"
                placeholder="请再次输入密码"
                show-password
                maxlength="32"
                @keyup.enter="onRegister"
              />
            </ElFormItem>
            <ElFormItem label="昵称" prop="nickname">
              <ElInput
                v-model.trim="registerForm.nickname"
                placeholder="选填，默认可后续修改"
                clearable
                maxlength="20"
              />
            </ElFormItem>
            <ElButton
              class="submit-btn"
              type="primary"
              :loading="registerLoading"
              @click="onRegister"
            >
              注册
            </ElButton>
          </ElForm>
          <p class="form-footer">
            已有账号？
            <span class="form-footer-link" @click="switchToLogin">返回登录</span>
          </p>
        </ElTabPane>
      </ElTabs>
    </div>
  </ElDialog>
</template>

<style lang="scss" src="./styles.scss" scoped />
