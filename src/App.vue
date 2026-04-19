<script setup lang="ts">
import { RouterView } from 'vue-router'
// 全局导入 toast 样式
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/message-box/style/css'
// element dark 模式
import 'element-plus/theme-chalk/dark/css-vars.css'
</script>

<template>
  <div class="app-wrapper">
    <RouterView />
  </div>
</template>

<style scoped>
.app-wrapper {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #08090d;
  background-image: linear-gradient(130deg, rgba(7, 9, 14, 72%), rgba(8, 9, 13, 90%)),
    url('@/assets/login_bg.jpg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}

.app-wrapper::before {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  content: '';
  background-image: linear-gradient(rgba(255, 255, 255, 4%) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 4%) 1px, transparent 1px),
    radial-gradient(circle at 22% 18%, rgba(125, 166, 255, 24%), transparent 26%),
    radial-gradient(circle at 86% 74%, rgba(255, 181, 71, 18%), transparent 28%);
  background-size: 42px 42px, 42px 42px, 100% 100%, 100% 100%;
  mask-image: linear-gradient(160deg, #000 0%, rgba(0, 0, 0, 82%) 52%, transparent 100%);
}

.app-wrapper::after {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  content: '';
  background-image: linear-gradient(115deg, transparent 0 58%, rgba(255, 181, 71, 16%) 58% 59%, transparent 59%),
    linear-gradient(160deg, rgba(255, 255, 255, 7%), transparent 28%);
}

.app-wrapper > * {
  z-index: 1;
}

@supports (background-image: url('@/assets/login_bg.webp')) {
  .app-wrapper {
    background-image: linear-gradient(130deg, rgba(7, 9, 14, 72%), rgba(8, 9, 13, 90%)),
      url('@/assets/login_bg.webp');
  }
}
</style>
