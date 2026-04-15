<template>
  <el-card class="order-summary">
    <template #header>
      <h3>訂單總結</h3>
    </template>
    
    <div class="summary-content">
      <!-- Subtotal -->
      <div class="summary-row">
        <span class="label">商品小計</span>
        <span class="value">NT$ {{ subtotal.toLocaleString() }}</span>
      </div>
      
      <!-- Automatic Discounts -->
      <div class="discounts-section" v-if="appliedDiscounts.length > 0">
        <div 
          v-for="discount in appliedDiscounts" 
          :key="discount.ruleId"
          class="summary-row discount-row"
        >
          <span class="label discount-label">{{ discount.tabName }}</span>
          <span class="value discount-value">-NT$ {{ discount.discountAmount.toLocaleString() }}</span>
        </div>
      </div>
      
      <!-- Coupon Discount -->
      <div class="summary-row discount-row" v-if="couponDiscountAmount > 0">
        <span class="label">優惠券折扣</span>
        <span class="value discount-value">-NT$ {{ couponDiscountAmount.toLocaleString() }}</span>
      </div>
      
      <!-- Coupon Info -->
      <div class="coupon-info" v-if="selectedCoupon">
        <el-tag type="success" size="small">
          {{ selectedCoupon.name }}
        </el-tag>
      </div>
      
      <!-- Shipping Fee -->
      <div class="summary-row">
        <span class="label">運費</span>
        <span class="value">NT$ {{ shippingFee.toLocaleString() }}</span>
      </div>
      
      <!-- Divider -->
      <el-divider />
      
      <!-- Final Total -->
      <div class="final-total">
        <span class="label">應付總額</span>
        <span class="value final-value">NT$ {{ totalAmount.toLocaleString() }}</span>
      </div>
      
      <!-- Confirm Button -->
      <el-button 
        type="primary" 
        size="large" 
        class="confirm-button"
        :disabled="!canConfirm"
        :loading="submitting"
        @click="handleConfirm"
      >
        {{ submitting ? '處理中...' : '確認訂單' }}
      </el-button>
      
      <!-- Validation Messages -->
      <div class="validation-messages" v-if="validationMessages.length > 0">
        <div 
          v-for="message in validationMessages" 
          :key="message"
          class="validation-message"
        >
          <el-icon><Warning /></el-icon>
          {{ message }}
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElCard, ElDivider, ElButton, ElTag, ElIcon } from 'element-plus'
import { Warning } from '@element-plus/icons-vue'
import type { CartItem, Coupon, Discount } from '@/model'

interface Props {
  cartItems: CartItem[]
  selectedCoupon: Coupon | null
  shippingFee: number
  discounts?: Discount[]
  recipientInfo: {
    name: string
    phone: string
    address: string
    remarks?: string
  }
  submitting: boolean
}

interface Emits {
  (e: 'confirm-order'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Calculate subtotal
const subtotal = computed(() => {
  return props.cartItems.reduce((total, item) => {
    return total + (item.unitPrice * item.quantity)
  }, 0)
})

// Calculate discount amount from coupon
const couponDiscountAmount = computed(() => {
  if (!props.selectedCoupon) return 0
  
  // Use fixed discount amount from coupon
  return props.selectedCoupon.discountAmount
})

// Get applied discounts from available discounts
const appliedDiscounts = computed(() => {
  if (!props.discounts || props.discounts.length === 0) return []
  
  return props.discounts.filter(discount => 
    discount.discountAmount > 0 && 
    discount.applicableItems.some(applicableItem => 
      props.cartItems.some(cartItem => cartItem.id === applicableItem.id)
    )
  )
})

// Calculate total discount amount from automatic discounts
const automaticDiscountAmount = computed(() => {
  return appliedDiscounts.value.reduce((total, discount) => {
    return total + discount.discountAmount
  }, 0)
})

// Total discount amount (coupon + automatic discounts)
const discountAmount = computed(() => {
  return couponDiscountAmount.value + automaticDiscountAmount.value
})

// Calculate total amount
const totalAmount = computed(() => {
  return subtotal.value - discountAmount.value + props.shippingFee
})

// Check if order can be confirmed
const canConfirm = computed(() => {
  return props.cartItems.length > 0 &&
         props.recipientInfo.name.trim() !== '' &&
         props.recipientInfo.phone.trim() !== '' &&
         props.recipientInfo.address.trim() !== ''
})

// Validation messages
const validationMessages = computed(() => {
  const messages = []
  
  if (props.cartItems.length === 0) {
    messages.push('購物車是空的')
  }
  
  if (props.recipientInfo.name.trim() === '') {
    messages.push('請輸入收件人姓名')
  }
  
  if (props.recipientInfo.phone.trim() === '') {
    messages.push('請輸入收件人電話')
  }
  
  if (props.recipientInfo.address.trim() === '') {
    messages.push('請輸入收件地址')
  }
  
  return messages
})

// Handle confirm button click
const handleConfirm = () => {
  if (canConfirm.value) {
    emit('confirm-order')
  }
}
</script>

<style scoped>
.order-summary {
  background: var(--el-bg-color);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.order-summary :deep(.el-card__header) {
  padding: 20px 20px 16px 20px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.order-summary :deep(.el-card__body) {
  padding: 20px;
}

.summary-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.discounts-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.discount-row {
  color: var(--el-color-danger);
}

.discount-label {
  font-size: 13px;
}

.label {
  color: var(--el-text-color-regular);
}

.value {
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.discount-value {
  color: var(--el-color-danger);
  font-weight: 500;
}

.coupon-info {
  display: flex;
  justify-content: flex-start;
  margin: 4px 0;
}

.final-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  padding-top: 8px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.final-value {
  color: var(--el-color-danger);
  font-size: 18px;
  font-weight: 600;
}

.confirm-button {
  width: 100%;
  margin-top: 20px;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
}

.validation-messages {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.validation-message {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--el-color-warning);
  background: var(--el-color-warning-light-9);
  padding: 8px 12px;
  border-radius: 4px;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .order-summary :deep(.el-card__body) {
    padding: 16px;
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
  
  .confirm-button {
    height: 44px;
    font-size: 15px;
  }
}
</style>
