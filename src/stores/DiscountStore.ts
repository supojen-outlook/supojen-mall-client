import { defineStore } from "pinia";
import type { Discount } from '@/model/index'

// 持久化處存的鍵名
const localStorageKey = 'discounts.cache'

export default defineStore('discount', {
  // 折扣狀態數據 
  state: () => {
    // 嘗試讀取本地緩存數據
    const savedCache = localStorage.getItem(localStorageKey);
    let discounts: Discount[] = []
    let lastUpdated: number = 0

    if (savedCache != null) {
      try {
        const parsed = JSON.parse(savedCache)
        discounts = parsed.discounts || []
        lastUpdated = parsed.lastUpdated || 0
      } catch (error) {
        console.error('Failed to parse cached discounts:', error)
      }
    }

    return {
      discounts,
      lastUpdated
    };
  },

  // 計算數據
  getters: {
    // 是否需要刷新（超過一天）
    shouldRefresh: (state): boolean => {
      const oneDay = 24 * 60 * 60 * 1000 // 24小時的毫秒數
      return Date.now() - state.lastUpdated > oneDay
    },
    
    // 是否有緩存數據
    hasCache: (state): boolean => {
      return state.discounts.length > 0 && state.lastUpdated > 0
    }
  },

  // 定義行為
  actions: {
    // 設置折扣（並緩存）
    setDiscounts(discounts: Discount[]) {
      // 儲存折扣到內存
      this.discounts = discounts
      this.lastUpdated = Date.now()
      // 將折扣存儲至本地緩存
      localStorage.setItem(localStorageKey, JSON.stringify({
        discounts: this.discounts,
        lastUpdated: this.lastUpdated
      }))
    },

    // 清除緩存
    clearCache() {
      this.discounts = []
      this.lastUpdated = 0
      localStorage.removeItem(localStorageKey)
    }
  }
});
