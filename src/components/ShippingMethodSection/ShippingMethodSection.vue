<template>
  <el-card class="shipping-method-section">
    <template #header>
      <h3>運送方式</h3>
    </template>
    
    <div class="shipping-content">
      <div class="shipping-methods">
        <div 
          v-for="method in availableShippingMethods" 
          :key="method"
          class="shipping-option"
          :class="{ 'selected': selectedMethod === method }"
          @click="selectMethod(method)"
        >
          <div class="shipping-left">
            <el-icon class="shipping-icon">
              <Van v-if="method === 'post'" />
              <Shop v-else-if="method === 'seven'" />
              <House v-else-if="method === 'family'" />
            </el-icon>
            <div class="shipping-info">
              <div class="shipping-name">{{ getShippingMethodName(method) }}</div>
              <div class="shipping-description">{{ getShippingMethodDescription(method) }}</div>
              <div class="shipping-time">
                <el-icon><Clock /></el-icon>
                預計 {{ getEstimatedDays(method) }} 天送達
              </div>
            </div>
          </div>
          <div class="shipping-right">
            <el-radio 
              :value="method"
              :model-value="selectedMethod"
              @change="handleMethodChange"
              class="shipping-radio"
            />
          </div>
        </div>
      </div>
      
      <!-- Shipping Method Info -->
      <div class="shipping-info-section" v-if="selectedMethod">
        <el-alert
          :title="getShippingMethodTitle(selectedMethod)"
          type="info"
          :closable="false"
          show-icon
        >
          {{ getShippingMethodInfo(selectedMethod) }}
        </el-alert>
      </div>
      
      <!-- Free Shipping Notice -->
      <div class="free-shipping-notice" v-if="hasFreeShipping">
        <el-text type="success" size="small">
          <el-icon><Check /></el-icon>
          訂單滿 NT$ {{ freeShippingThreshold }} 即享免運費
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
import { Van, Shop, House, Clock, Check } from '@element-plus/icons-vue'
import type { ShipmentMethod } from '@/model/Shipment'

interface Props {
  selectedMethod: ShipmentMethod
  shippingFee: number
}

interface Emits {
  (e: 'method-selected', method: ShipmentMethod): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const selectedMethod = ref<ShipmentMethod>(props.selectedMethod)

// Available shipping methods
const availableShippingMethods = computed(() => {
  const methods: ShipmentMethod[] = ['post', 'seven', 'family']
  return methods
})

// Free shipping threshold (for demonstration)
const freeShippingThreshold = ref(1000)

// Check if order has free shipping
const hasFreeShipping = computed(() => {
  return props.shippingFee >= freeShippingThreshold.value
})

// Watch for external selected method changes
watch(() => props.selectedMethod, (newMethod) => {
  selectedMethod.value = newMethod
}, { immediate: true })

// Get shipping method display name
const getShippingMethodName = (method: ShipmentMethod): string => {
  const names: Record<ShipmentMethod, string> = {
    'post': '中華郵政',
    'seven': '7-11 超商取貨',
    'family': '全家超商取貨'
  }
  return names[method] || method
}

// Get shipping method description
const getShippingMethodDescription = (method: ShipmentMethod): string => {
  const descriptions: Record<ShipmentMethod, string> = {
    'post': '全台配送，偏遠地區可能延遲',
    'seven': '全台 7-11 門市取貨，營業時間內 2 小時到貨',
    'family': '全台全家門市取貨，營業時間內 2 小時到貨'
  }
  return descriptions[method] || ''
}


// Get estimated delivery days
const getEstimatedDays = (method: ShipmentMethod): number => {
  const days: Record<ShipmentMethod, number> = {
    'post': 3,
    'seven': 2,
    'family': 2
  }
  return days[method] || 3
}

// Get shipping method info title
const getShippingMethodTitle = (method: ShipmentMethod): string => {
  return `關於 ${getShippingMethodName(method)}`
}

// Get shipping method detailed info
const getShippingMethodInfo = (method: ShipmentMethod): string => {
  const infos: Record<ShipmentMethod, string> = {
    'post': '郵局配送時間為週一至週五，例假日順延，配送時段為 9:00-17:00',
    'seven': '取貨期限 7 天，逾期將自動取消訂單，取貨時請備訂單號碼',
    'family': '取貨期限 7 天，逾期將自動取消訂單，取貨時請備訂單號碼'
  }
  return infos[method] || ''
}

// Handle method selection
const selectMethod = (method: ShipmentMethod) => {
  emit('method-selected', method)
}

// Handle radio change
const handleMethodChange = () => {
  // Radio change is handled by selectMethod
}
</script>

<style scoped>
.shipping-method-section {
  background: var(--el-bg-color);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.shipping-method-section :deep(.el-card__header) {
  padding: 20px 20px 16px 20px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.shipping-method-section :deep(.el-card__body) {
  padding: 20px;
}

.shipping-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.shipping-methods {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.shipping-option {
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
  align-items: flex-start;
  cursor: pointer;
}

.shipping-option:hover {
  border-color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}

.shipping-option.selected {
  border-color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}

.shipping-left {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
}

.shipping-right {
  display: flex;
  align-items: center;
}

.shipping-icon {
  font-size: 20px;
  color: var(--el-color-primary);
  margin-top: 2px;
}

.shipping-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.shipping-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  line-height: 1.4;
}

.shipping-description {
  font-size: 14px;
  color: var(--el-text-color-regular);
  line-height: 1.4;
}

.shipping-time {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--el-text-color-regular);
}

.fee-tag {
  font-weight: 500;
}

.shipping-radio {
  margin: 0;
}

.shipping-radio :deep(.el-radio__input) {
  display: block;
}

.shipping-radio :deep(.el-radio__label) {
  display: none;
}

.shipping-info-section {
  margin-top: 16px;
}

.free-shipping-notice {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px;
  background: var(--el-color-success-light-9);
  border-radius: 6px;
  border: 1px solid var(--el-color-success-light-7);
}

/* Radio button custom styles */
.shipping-option :deep(.el-radio__input) {
  display: none;
}

.shipping-option :deep(.el-radio__label) {
  padding: 0;
  width: 100%;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .shipping-method-section :deep(.el-card__body) {
    padding: 16px;
  }
  
  .shipping-option {
    padding: 12px;
  }
  
  .shipping-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .shipping-name {
    font-size: 15px;
  }
  
  .shipping-description {
    font-size: 13px;
  }
}
</style>
