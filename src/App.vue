<template>
  <div class="app-wrapper">
    <!-- 全局導航欄（認證頁面除外） -->
    <TopNavBar v-if="!hideNavbar" />
    
    <!-- 頁面內容 -->
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TopNavBar from '@/components/TopNavBar/TopNavBar.vue'

const route = useRoute()

// 根據路由 meta 決定是否隱藏導航欄
const hideNavbar = computed(() => {
  return route.meta?.hideNavbar === true
})
</script>

<style>
.app-wrapper {
  min-height: 100vh;
}
</style>
