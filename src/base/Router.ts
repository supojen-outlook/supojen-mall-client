import { createRouter, createWebHistory } from 'vue-router'
import { useAccountStore } from '@/stores'
import { getProfile } from '@/services'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('../views/HomePage.vue')
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('../views/AboutPage.vue')
        },
        {
            path: '/product/:id',
            name: 'product',
            component: () => import('../views/ProductPage.vue')
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/LoginPage.vue'),
            meta: { hideNavbar: true }
        },
        {
            path: '/signup',
            name: 'signup',
            component: () => import('../views/SignupPage.vue'),
            meta: { hideNavbar: true }
        },
        {
            path: '/reset-password',
            name: 'reset-password',
            component: () => import('../views/ResetPasswordPage.vue'),
            meta: { hideNavbar: true }
        },
        {
            path: '/shopping-cart',
            name: 'shopping-cart',
            component: () => import('../views/CartPage.vue')
        },
        {
            path: '/confirm-order',
            name: 'confirm-order',
            component: () => import('../views/ConfirmOrderPage.vue')
        },
        {
            path: '/my-orders',
            name: 'my-orders',
            component: () => import('../views/MyOrdersPage.vue')
        },
        {
            path: '/search',
            name: 'search',
            component: () => import('../views/SearchPage.vue')
        },
        {
            path: '/profile',
            name: 'profile',
            component: () => import('../views/ProfilePage.vue')
        },
        {
            path: '/checkout',
            name: 'checkout',
            component: () => import('../views/CheckoutPage.vue')
        },
    ]
})

router.beforeEach(async (to, _, next)  => {
  const accountStore = useAccountStore()
  const publicPages = ['/login', '/signup', '/reset-password'] // 不需要登入的頁面
  const authRequired = !publicPages.includes(to.path)

  // 如果頁面需要認證但用戶未登入
  if (authRequired && !accountStore.isLogin) {
    try {
      // 嘗試獲取用戶資料
      const profile = await getProfile()

      console.log(profile)

      accountStore.login(profile)
      next()
    } catch (error) {
      // 如果獲取失敗，重定向到登入頁
      next('/login')
    }
  } else {
    if(to.name == '') {
      next('home')
    }else {
      next()
    }
  }
  
})

export default router