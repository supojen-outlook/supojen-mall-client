<template>
  <div class="checkout-summary">
    <div class="summary-header">
      <h3>結帳明細</h3>
    </div>
    
    <div class="summary-content">
      <!-- Original Price -->
      <div class="summary-row">
        <span class="label">商品原價總金額</span>
        <span class="value">NT$ {{ originalTotal.toLocaleString() }}</span>
      </div>
      
      <!-- Discounts -->
      <div class="discounts-section" v-if="totalDiscount > 0">
        <div 
          v-for="discount in appliedDiscounts" 
          :key="discount.ruleId"
          class="discount-row"
        >
          <span class="label discount-label">{{ discount.tabName }}</span>
          <span class="value discount-value">-NT$ {{ discount.discountAmount.toLocaleString() }}</span>
        </div>
      </div>
      
      <!-- Free Shipping Info -->
      <div class="free-shipping-info" v-if="hasFreeShipping">
        <el-tag type="success" size="small">
          <el-icon><Check /></el-icon>
          免運優惠
        </el-tag>
      </div>
      
      <!-- Divider -->
      <el-divider />
      
      <!-- Final Total -->
      <div class="final-total">
        <span class="label">結帳金額</span>
        <span class="value final-value">NT$ {{ finalTotal.toLocaleString() }}</span>
      </div>
      
      <!-- Checkout Button -->
      <el-button 
        type="primary" 
        size="large" 
        class="checkout-button"
        :disabled="cartItems.length === 0"
        @click="proceedToCheckout"
      >
        結帳 ({{ cartItems.length }})
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElDivider, ElButton, ElTag, ElIcon } from 'element-plus'
import { Check } from '@element-plus/icons-vue'
import type { CartItem, Discount } from '@/model'

interface Props {
  cartItems: CartItem[]
  discounts: Discount[]
}

const props = defineProps<Props>()
const router = useRouter()

// Calculate original total price
const originalTotal = computed(() => {
  return props.cartItems.reduce((total, item) => {
    return total + (item.unitPrice * item.quantity)
  }, 0)
})

// Get applied discounts
const appliedDiscounts = computed(() => {
  return props.discounts.filter(discount => 
    discount.discountAmount > 0 && 
    discount.applicableItems.some(applicableItem => 
      props.cartItems.some(cartItem => cartItem.id === applicableItem.id)
    )
  )
})

// Calculate total discount amount
const totalDiscount = computed(() => {
  return appliedDiscounts.value.reduce((total, discount) => {
    return total + discount.discountAmount
  }, 0)
})

// Check if has free shipping
const hasFreeShipping = computed(() => {
  return props.discounts.some(discount => 
    discount.isFreeShipping && 
    discount.applicableItems.some(applicableItem => 
      props.cartItems.some(cartItem => cartItem.id === applicableItem.id)
    )
  )
})

// Calculate final total
const finalTotal = computed(() => {
  return originalTotal.value - totalDiscount.value
})

// Proceed to checkout
const proceedToCheckout = () => {
  router.push('/confirm-order')
}
</script>

<style scoped>
.checkout-summary {
  background: var(--el-bg-color);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.summary-header h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.summary-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.label {
  color: var(--el-text-color-regular);
}

.value {
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.discounts-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.discount-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.discount-label {
  color: var(--el-color-danger);
}

.discount-value {
  color: var(--el-color-danger);
  font-weight: 500;
}

.free-shipping-info {
  display: flex;
  justify-content: flex-start;
  margin: 8px 0;
}

.final-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
}

.final-value {
  color: var(--el-color-danger);
  font-size: 18px;
}

.checkout-button {
  width: 100%;
  margin-top: 20px;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .checkout-summary {
    padding: 16px;
  }
  
  .summary-header h3 {
    font-size: 16px;
  }
  
  .summary-row {
    font-size: 13px;
  }
  
  .final-total {
    font-size: 14px;
  }
  
  .final-value {
    font-size: 16px;
  }
  
  .checkout-button {
    height: 44px;
    font-size: 15px;
  }
}
</style>
