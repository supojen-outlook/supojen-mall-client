<template>
  <div class="cart-page">
    <div class="loading" v-if="loading">
      <el-loading :loading="loading" />
    </div>
    
    <div class="error" v-else-if="error">
      <el-result
        icon="error"
        title="載入失敗"
        :sub-title="error"
      >
        <template #extra>
          <el-button type="primary" @click="fetchCartData">
            重新載入
          </el-button>
        </template>
      </el-result>
    </div>
    
    <div class="cart-container" v-else>
      <!-- Back Button -->
      <div class="back-section">
        <el-button 
          @click="goBack"
          class="back-button"
          :icon="ArrowLeft"
          text
        >
          返回
        </el-button>
      </div>
      
      <div class="cart-main">
        <!-- Left: Cart Items -->
        <div class="cart-items-section">
          <CartItemList 
            :cart-items="cartItems"
            :discounts="discounts"
            @item-updated="handleItemUpdated"
            @item-deleted="handleItemDeleted"
            @item-moved="handleItemMoved"
          />
        </div>
        
        <!-- Right: Checkout Summary -->
        <div class="checkout-section">
          <CheckoutSummary 
            :cart-items="cartItems"
            :discounts="discounts"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElLoading, ElResult, ElButton } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { getCartItems } from '@/services/CartItem'
import { getAvailableDiscounts } from '@/services/Discount'
import type { CartItem, Discount } from '@/model'
import { CartItemList } from '@/components/CartItemList'
import { CheckoutSummary } from '@/components/CheckoutSummary'
import { useDiscountStore } from '@/stores'

// Reactive state
const loading = ref(true)
const error = ref<string | null>(null)
const cartItems = ref<CartItem[]>([])
const discounts = ref<Discount[]>([])

// Discount store
const discountStore = useDiscountStore()

// Fetch cart data
const fetchCartData = async () => {
  try {
    loading.value = true
    error.value = null
    
    // Fetch cart items
    const cartData = await getCartItems({ type: 'shopping' })
    cartItems.value = cartData.list || []
    
    // Fetch discounts with caching logic
    await fetchDiscounts()
    
  } catch (err) {
    console.error('Failed to fetch cart data:', err)
    error.value = '無法載入購物車資料，請稍後再試。'
  } finally {
    loading.value = false
  }
}

// Fetch discounts with caching mechanism
const fetchDiscounts = async () => {
  try {
    if (discountStore.hasCache && !discountStore.shouldRefresh) {
      // Use cached data from store
      discounts.value = discountStore.discounts
    } else {
      // Fetch fresh data and cache to store
      const freshDiscounts = await getAvailableDiscounts()
      discounts.value = freshDiscounts
      discountStore.setDiscounts(freshDiscounts)
    }
  } catch (err) {
    console.error('Failed to fetch discounts:', err)
    // Don't fail the whole cart if discounts fail
    discounts.value = []
  }
}

// Handle cart item updates
const handleItemUpdated = async () => {
  await fetchCartData()
}

const handleItemDeleted = async () => {
  await fetchCartData()
}

const handleItemMoved = async () => {
  await fetchCartData()
}

// Go back to previous page
const goBack = () => {
  window.history.back()
}

// Fetch data on component mount
onMounted(fetchCartData)
</script>

<style scoped>
.cart-page {
  min-height: 100vh;
  background-color: var(--el-bg-color-page);
  padding: 20px;
}

.loading, .error {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.cart-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.cart-main {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
  margin-top: 20px;
}

.cart-items-section {
  width: 100%;
}

.checkout-section {
  width: 100%;
  position: sticky;
  top: 20px;
  height: fit-content;
}

.back-section {
  margin-bottom: 12px;
}

.back-button {
  font-size: 14px;
  color: var(--el-text-color-regular);
}

/* Mobile responsive */
@media (max-width: 1024px) {
  .cart-main {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .checkout-section {
    position: static;
  }
}

@media (max-width: 768px) {
  .cart-container {
    max-width: 100%;
    padding: 16px;
  }
  
  .cart-main {
    gap: 20px;
  }
}
</style>
