<script setup lang="ts">
import { computed, ref } from 'vue'
import { SwitchButton } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { useWsLoginStore } from '@/stores/ws'
import { useGroupStore } from '@/stores/group'
import { useGlobalStore } from '@/stores/global'
import { computedToken } from '@/services/request'
import { judgeClient } from '@/utils/detectDevice'

const client = judgeClient()
const visible = ref(false)
const userStore = useUserStore()
const loginStore = useWsLoginStore()
const groupStore = useGroupStore()
const globalStore = useGlobalStore()

const avatar = computed(() => userStore?.userInfo.avatar)
const unReadMark = computed(() => globalStore.unReadMark)
const showSettingBox = () => (visible.value = true)
const toggleGroupListShow = () => (groupStore.showGroupList = !groupStore.showGroupList)
// 是否PC端
const isPc = computed(() => client === 'PC')

const logout = () => {
  if (!userStore.isSign) {
    loginStore.showLogin = true
    return
  }

  userStore.isSign = false
  userStore.userInfo = {}
  localStorage.removeItem('TOKEN')
  localStorage.removeItem('USER_INFO')
  computedToken.clear()
  loginStore.resetLoginState()
  visible.value = false
}
</script>

<template>
  <aside class="side-toolbar">
    <Avatar :src="userStore.isSign ? avatar : ''" :size="isPc ? 50 : 40" v-login="showSettingBox" />
    <div class="tool-icons">
      <!-- 会话 -->
      <router-link exactActiveClass="tool-icon-active" to="/">
        <el-badge
          :value="unReadMark.newMsgUnreadCount"
          :hidden="unReadMark.newMsgUnreadCount === 0"
          :max="99"
        >
          <Icon class="tool-icon" icon="chat" :size="28" />
        </el-badge>
      </router-link>
      <!-- 联系人 -->
      <router-link v-login-show exactActiveClass="tool-icon-active" to="/contact">
        <el-badge
          :value="unReadMark.newFriendUnreadCount"
          :hidden="unReadMark.newFriendUnreadCount === 0"
          :max="99"
        >
          <Icon class="tool-icon" icon="group" :size="28" />
        </el-badge>
      </router-link>
    </div>
    <div class="menu">
      <button class="logout-btn" type="button" title="退出登录" @click="logout">
        <el-icon :size="22"><SwitchButton /></el-icon>
        <span class="logout-text">退出</span>
      </button>
    </div>
    <Icon icon="zhankai" :size="28" @click="toggleGroupListShow" />
    <UserSettingBox v-model="visible" />
  </aside>
</template>

<style lang="scss" src="./styles.scss" scoped />
