<template>
  <el-card class="payment-method-section">
    <template #header>
      <h3>付款方式</h3>
    </template>
    
    <div class="payment-content">
      <div class="payment-methods">
        <div 
          v-for="method in availablePaymentMethods" 
          :key="method"
          class="payment-option"
          :class="{ 'selected': selectedMethod === method }"
          @click="selectMethod(method)"
        >
          <div class="payment-left">
            <el-icon class="payment-icon">
              <CreditCard v-if="method.includes('credit_card')" />
              <Wallet v-else-if="method.includes('mobile')" />
              <Money v-else-if="method.includes('atm')" />
              <Coin v-else-if="method.includes('cash')" />
              <CreditCard v-else />
            </el-icon>
            <div class="payment-info">
              <div class="payment-name">{{ getPaymentMethodName(method) }}</div>
              <div class="payment-description">{{ getPaymentMethodDescription(method) }}</div>
            </div>
          </div>
          <div class="payment-right">
            <el-radio 
              :value="method"
              :model-value="selectedMethod"
              @change="handleMethodChange"
              class="payment-radio"
            />
          </div>
        </div>
      </div>
      
      <!-- Payment Method Info -->
      <div class="payment-info-section" v-if="selectedMethod">
        <el-alert
          :title="getPaymentMethodTitle(selectedMethod)"
          type="info"
          :closable="false"
          show-icon
        >
          {{ getPaymentMethodInfo(selectedMethod) }}
        </el-alert>
      </div>
      
      <!-- Security Notice -->
      <div class="security-notice">
        <el-text type="info" size="small">
          <el-icon><Lock /></el-icon>
          所有付款資訊都經過加密保護，確保您的交易安全
        </el-text>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { 
  ElCard, 
  ElRadio, 
  ElIcon, 
  ElAlert, 
  ElText 
} from 'element-plus'
import { 
  CreditCard, 
  Wallet, 
  Money, 
  Coin, 
  Lock 
} from '@element-plus/icons-vue'
import type { PaymentMethod } from '@/model/Payment'

interface Props {
  selectedMethod: PaymentMethod
}

interface Emits {
  (e: 'method-selected', method: PaymentMethod): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const selectedMethod = ref<PaymentMethod>(props.selectedMethod)

// Available payment methods (excluding cash)
const availablePaymentMethods = computed(() => {
  const allMethods: PaymentMethod[] = [
    'credit_card_one_time',
    'atm_virtual',
    'taiwan_pay'
  ]
  return allMethods
})

// Watch for external selected method changes
watch(() => props.selectedMethod, (newMethod) => {
  selectedMethod.value = newMethod
}, { immediate: true })

// Get payment method display name
const getPaymentMethodName = (method: PaymentMethod): string => {
  const names: Record<PaymentMethod, string> = {
    'credit_card_one_time': '信用卡一次付清',
    'atm_virtual': '虛擬帳號',
    'taiwan_pay': '台灣Pay',
    'cash': '現金'
  }
  return names[method] || method
}

// Get payment method description
const getPaymentMethodDescription = (method: PaymentMethod): string => {
  const descriptions: Record<PaymentMethod, string> = {
    'credit_card_one_time': '支援 Visa、Mastercard、JCB 等信用卡',
    'atm_virtual': '透過 ATM 轉帳付款',
    'taiwan_pay': '支援台灣 Pay 行動支付',
    'cash': '貨到付款'
  }
  return descriptions[method] || ''
}

// Get payment method info title
const getPaymentMethodTitle = (method: PaymentMethod): string => {
  return `關於 ${getPaymentMethodName(method)}`
}

// Get payment method detailed info
const getPaymentMethodInfo = (method: PaymentMethod): string => {
  const infos: Record<PaymentMethod, string> = {
    'credit_card_one_time': '一次付清享額外 1% 現金回饋，交易安全有保障',
    'atm_virtual': '付款期限 3 天，逾期訂單將自動取消',
    'taiwan_pay': '整合多種行動支付，安全又方便',
    'cash': '配送員送貨時收款，請準備現金'
  }
  return infos[method] || ''
}

// Handle method selection
const selectMethod = (method: PaymentMethod) => {
  emit('method-selected', method)
}

// Handle radio change
const handleMethodChange = () => {
  // Radio change is handled by selectMethod
}
</script>

<style scoped>
.payment-method-section {
  background: var(--el-bg-color);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.payment-method-section :deep(.el-card__header) {
  padding: 20px 20px 16px 20px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.payment-method-section :deep(.el-card__body) {
  padding: 20px;
}

.payment-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.payment-option {
  width: 100%;
  margin: 0;
  padding: 16px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  background: var(--el-bg-color);
  transition: all 0.3s ease;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.payment-option:hover {
  border-color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}

.payment-option.selected {
  border-color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}

.payment-left {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
}

.payment-right {
  display: flex;
  align-items: center;
}

.payment-icon {
  font-size: 20px;
  color: var(--el-color-primary);
  margin-top: 2px;
}

.payment-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.payment-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  line-height: 1.4;
}

.payment-description {
  font-size: 14px;
  color: var(--el-text-color-regular);
  line-height: 1.4;
}

.payment-radio {
  margin: 0;
}

.payment-radio :deep(.el-radio__input) {
  display: block;
}

.payment-radio :deep(.el-radio__label) {
  display: none;
}

.payment-info-section {
  margin-top: 16px;
}

.security-notice {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px;
  background: var(--el-fill-color-light);
  border-radius: 6px;
  border: 1px solid var(--el-border-color-lighter);
}

/* Radio button custom styles */
.payment-option :deep(.el-radio__input) {
  display: none;
}

.payment-option :deep(.el-radio__label) {
  padding: 0;
  width: 100%;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .payment-method-section :deep(.el-card__body) {
    padding: 16px;
  }
  
  .payment-option {
    padding: 12px;
  }
  
  .payment-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .payment-name {
    font-size: 15px;
  }
  
  .payment-description {
    font-size: 13px;
  }
}
</style>
