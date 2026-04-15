<template>
  <header class="site-nav-wrapper">
    <nav class="nav-container">
      <!-- 手機版漢堡按鈕 -->
      <div class="mobile-menu-btn" @click="toggleMobileMenu">
        <el-icon><Menu /></el-icon>
      </div>
      
      <!-- Logo -->
      <div class="nav-logo" @click="goHome">
        <img src="/logo.png" alt="Logo" />
      </div>
      
      <!-- 桌面版導航 -->
      <ul class="nav-menu desktop-nav">
        <li><a href="/about">關於我們</a></li>
        <li><a href="/shopping-cart">購物車</a></li>
        <li><a href="/my-orders">我的訂單</a></li>
      </ul>
      
      <!-- 用戶操作區 -->
      <div class="user-actions">
        <!-- 未登入顯示登入按鈕 -->
        <a v-if="!isLogin" href="/login" class="login-link">註冊｜登入</a>
        
        <!-- 登入後顯示用戶下拉選單 -->
        <el-dropdown v-else trigger="hover" @command="handleCommand">
          <span class="user-dropdown-trigger">
            <el-avatar :size="32" :src="userAvatar" class="nav-avatar" />
            <span class="user-name desktop-only">{{ userDisplayName }}</span>
            <el-icon class="dropdown-icon desktop-only"><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="cart">
                <el-icon><ShoppingCart /></el-icon>
                購物車
              </el-dropdown-item>
              <el-dropdown-item command="profile">
                <el-icon><User /></el-icon>
                個人資料
              </el-dropdown-item>
              <el-dropdown-item command="orders">
                <el-icon><Document /></el-icon>
                我的訂單
              </el-dropdown-item>
              <el-dropdown-item divided command="logout">
                <el-icon><SwitchButton /></el-icon>
                登出
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </nav>
    
    <!-- 手機版全頁選單 -->
    <div v-if="isMobileMenuOpen" class="mobile-menu-overlay">
      <div class="mobile-menu-header">
        <span class="mobile-menu-title">選單</span>
        <div class="mobile-menu-close" @click="closeMobileMenu">
          <el-icon><Close /></el-icon>
        </div>
      </div>
      
      <div class="mobile-menu-user" v-if="isLogin">
        <el-avatar :size="48" :src="userAvatar" />
        <span class="mobile-user-name">{{ userDisplayName }}</span>
      </div>
      
      <ul class="mobile-menu-list">
        <li @click="handleMobileNav('/about')">
          <el-icon><InfoFilled /></el-icon>
          關於我們
        </li>
        <li @click="handleMobileNav('/shopping-cart')">
          <el-icon><ShoppingCart /></el-icon>
          購物車
        </li>
        <li @click="handleMobileNav('/my-orders')">
          <el-icon><Document /></el-icon>
          我的訂單
        </li>
        <li v-if="isLogin" @click="handleCommand('profile')">
          <el-icon><User /></el-icon>
          個人資料
        </li>
      </ul>
      
      <div class="mobile-menu-footer" v-if="isLogin">
        <el-button type="danger" @click="handleCommand('logout')" style="width: 100%">
          <el-icon><SwitchButton /></el-icon>
          登出
        </el-button>
      </div>
      
      <div class="mobile-menu-footer" v-else>
        <el-button type="primary" @click="handleMobileNav('/login')" style="width: 100%">
          註冊｜登入
        </el-button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  ArrowDown, 
  User, 
  Document, 
  SwitchButton,
  ShoppingCart,
  Menu,
  Close,
  InfoFilled
} from '@element-plus/icons-vue'
import { useAccountStore } from '@/stores'
import { signOut } from '@/services'

const router = useRouter()
const accountStore = useAccountStore()

// 手機版選單狀態
const isMobileMenuOpen = ref(false)

// 計算屬性
const isLogin = computed(() => accountStore.isLogin)
const userDisplayName = computed(() => {
  return accountStore.profile?.displayName || '用戶'
})
const userAvatar = computed(() => {
  return accountStore.profile?.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
})

// 切換手機版選單
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// 關閉手機版選單
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// 手機版導航
const handleMobileNav = (path: string) => {
  closeMobileMenu()
  router.push(path)
}

// 回到首頁
const goHome = () => {
  router.push('/')
}

// 處理下拉選單命令
const handleCommand = async (command: string) => {
  closeMobileMenu() // 手機版點擊後關閉選單
  switch (command) {
    case 'cart':
      router.push('/shopping-cart')
      break
    case 'profile':
      router.push('/profile')
      break
    case 'orders':
      router.push('/my-orders')
      break
    case 'logout':
      try {
        await signOut()
        accountStore.logout()
        ElMessage.success('已成功登出')
        router.push('/login')
      } catch (error) {
        console.error('Logout error:', error)
        accountStore.logout()
        router.push('/login')
      }
      break
  }
}
</script>

<style scoped>
/* 導航欄樣式 */
.site-nav-wrapper {
  width: 100%;
  background-color: var(--el-tertiary-container-color);
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.nav-container {
  width: 96%; 
  max-width: 1200px;
  margin: 0 auto;
  padding: 4px 16px; 
  display: flex;
  align-items: center;
  box-sizing: border-box;
  gap: 16px;
}

@media (min-width: 1600px) {
  .nav-container {
    max-width: 1600px;
  }
}

/* Logo 樣式 */
.nav-logo {
  flex-shrink: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.nav-logo img {
  height: 28px;
  width: auto;
  object-fit: contain;
}

/* 桌面版導航 */
.nav-menu {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  flex: 1; 
  gap: 24px;
}

.nav-menu li a {
  text-decoration: none;
  color: var(--el-tertiary-on-container-color);
  font-weight: 500;
  font-size: 13px;
  white-space: nowrap;
  transition: opacity 0.2s;
}
.nav-menu li a:hover { opacity: 0.7; }

/* 用戶操作區 */
.user-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
}

.login-link {
  text-decoration: none;
  color: var(--el-tertiary-on-container-color);
  font-weight: 500;
  font-size: 13px;
  white-space: nowrap;
  transition: opacity 0.2s;
}
.login-link:hover { opacity: 0.7; }

/* 用戶下拉選單樣式 */
.user-dropdown-trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 16px;
  transition: background-color 0.2s;
}

.user-dropdown-trigger:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.nav-avatar {
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.user-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--el-tertiary-on-container-color);
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-icon {
  font-size: 12px;
  color: var(--el-tertiary-on-container-color);
}

/* 手機版漢堡按鈕 */
.mobile-menu-btn {
  display: none;
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
  color: var(--el-tertiary-on-container-color);
  flex-shrink: 0;
}

/* 手機版全頁選單 */
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--el-bg-color);
  z-index: 2000;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
}

.mobile-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--el-border-color);
  margin-bottom: 20px;
}

.mobile-menu-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.mobile-menu-close {
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
  color: var(--el-text-color-primary);
}

.mobile-menu-user {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  margin-bottom: 20px;
}

.mobile-user-name {
  font-size: 16px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.mobile-menu-list {
  list-style: none;
  margin: 0;
  padding: 0;
  flex: 1;
  overflow-y: auto;
}

.mobile-menu-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 0;
  font-size: 16px;
  color: var(--el-text-color-primary);
  cursor: pointer;
  border-bottom: 1px solid var(--el-border-color-lighter);
  transition: background-color 0.2s;
}

.mobile-menu-list li:hover {
  background-color: var(--el-fill-color-light);
  margin: 0 -20px;
  padding-left: 20px;
  padding-right: 20px;
}

.mobile-menu-list li .el-icon {
  font-size: 20px;
  color: var(--el-color-primary);
}

.mobile-menu-footer {
  padding-top: 20px;
  border-top: 1px solid var(--el-border-color);
}

/* RWD 斷點 */
@media (max-width: 768px) {
  .nav-container {
    padding: 4px 12px;
    gap: 8px;
  }
  
  /* 顯示漢堡按鈕 */
  .mobile-menu-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  /* 隱藏桌面版導航 */
  .desktop-nav {
    display: none;
  }
  
  /* 桌面版專用元素隱藏 */
  .desktop-only {
    display: none;
  }
  
  /* Logo 置中 */
  .nav-logo {
    flex: 1;
    justify-content: center;
  }
  
  .nav-logo img {
    height: 24px;
  }
  
  /* 用戶操作區 */
  .user-actions {
    margin-left: 0;
  }
  
  /* 下拉選單觸發區域調整 */
  .user-dropdown-trigger {
    padding: 4px;
  }
}

/* 更小螢幕的調整 */
@media (max-width: 375px) {
  .nav-container {
    padding: 4px;
  }
  
  .nav-logo img {
    height: 22px;
  }
}
</style>
