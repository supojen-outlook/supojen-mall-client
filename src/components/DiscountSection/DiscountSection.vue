<template>
  <el-card class="discount-section">
    <template #header>
      <h3>優惠券</h3>
    </template>
    
    <div class="discount-content">
      <!-- Coupon Selection -->
      <div class="coupon-selection">
        <el-select
          v-model="selectedCouponId"
          placeholder="選擇優惠券"
          clearable
          @change="handleCouponChange"
          @clear="handleCouponClear"
        >
          <el-option
            v-for="coupon in availableCoupons"
            :key="coupon.id"
            :label="couponLabel(coupon)"
            :value="coupon.id"
            :disabled="!isCouponValid(coupon)"
          >
            <div class="coupon-option">
              <div class="coupon-name">{{ coupon.name }}</div>
              <div class="coupon-discount">折抵 ${{ coupon.discountAmount }}</div>
              <div class="coupon-validity">有效期至：{{ formatDate(coupon.validUntil) }}</div>
            </div>
          </el-option>
        </el-select>
      </div>
      
      <!-- Selected Coupon Info -->
      <div class="selected-coupon-info" v-if="selectedCoupon">
        <el-tag type="success" size="large" class="coupon-tag">
          <el-icon><Discount /></el-icon>
          {{ selectedCoupon.name }} - 折抵 ${{ selectedCoupon.discountAmount }}
        </el-tag>
        <div class="coupon-description" v-if="selectedCoupon.description">
          {{ selectedCoupon.description }}
        </div>
      </div>
      
      <!-- No Coupon Selected -->
      <div class="no-coupon-info" v-else>
        <el-text type="info" size="small">
          <el-icon><InfoFilled /></el-icon>
          選擇優惠券可享額外折扣
        </el-text>
      </div>
      
      <!-- Available Coupons List -->
      <div class="available-coupons" v-if="availableCoupons.length > 0">
        <h4>可用優惠券</h4>
        <div class="coupon-list">
          <div 
            v-for="coupon in availableCoupons"
            :key="coupon.id"
            class="coupon-card"
            :class="{ 
              'selected': selectedCouponId === coupon.id,
              'disabled': !isCouponValid(coupon)
            }"
            @click="selectCoupon(coupon)"
          >
            <div class="coupon-header">
              <span class="coupon-name">{{ coupon.name }}</span>
              <el-tag 
                :type="isCouponValid(coupon) ? 'success' : 'info'"
                size="small"
              >
                ${{ coupon.discountAmount }} OFF
              </el-tag>
            </div>
            <div class="coupon-body">
              <div class="coupon-description" v-if="coupon.description">
                {{ coupon.description }}
              </div>
              <div class="coupon-validity">
                有效期：{{ formatDate(coupon.validFrom) }} 至 {{ formatDate(coupon.validUntil) }}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- No Available Coupons -->
      <div class="no-coupons" v-else>
        <el-empty description="目前沒有可用的優惠券" />
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElCard, ElSelect, ElOption, ElTag, ElIcon, ElText, ElEmpty } from 'element-plus'
import { Discount, InfoFilled } from '@element-plus/icons-vue'
import type { Coupon } from '@/model'

interface Props {
  coupons: Coupon[]
  selectedCoupon: Coupon | null
}

interface Emits {
  (e: 'coupon-selected', coupon: Coupon | null): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const selectedCouponId = ref<number | null>(null)

// Filter available coupons (not used and valid)
const availableCoupons = computed(() => {
  return props.coupons.filter(coupon => 
    !coupon.isUsed && isCouponValid(coupon)
  )
})

// Watch for external selected coupon changes
watch(() => props.selectedCoupon, (newCoupon) => {
  selectedCouponId.value = newCoupon?.id || null
}, { immediate: true })

// Check if coupon is valid
const isCouponValid = (coupon: Coupon): boolean => {
  const now = new Date()
  const validFrom = new Date(coupon.validFrom)
  const validUntil = coupon.validUntil ? new Date(coupon.validUntil) : null
  
  return now >= validFrom && (!validUntil || now <= validUntil)
}

// Format coupon label for select
const couponLabel = (coupon: Coupon): string => {
  return `${coupon.name} - 折抵 $${coupon.discountAmount}`
}

// Format date
const formatDate = (dateString: string | null): string => {
  if (!dateString) return '永久有效'
  return new Date(dateString).toLocaleDateString('zh-TW')
}

// Handle coupon selection change
const handleCouponChange = (couponId: number | null) => {
  const coupon = couponId ? availableCoupons.value.find(c => c.id === couponId) || null : null
  emit('coupon-selected', coupon)
}

// Handle coupon clear
const handleCouponClear = () => {
  emit('coupon-selected', null)
}

// Select coupon from card
const selectCoupon = (coupon: Coupon) => {
  if (isCouponValid(coupon)) {
    selectedCouponId.value = coupon.id
    emit('coupon-selected', coupon)
  }
}
</script>

<style scoped>
.discount-section {
  background: var(--el-bg-color);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.discount-section :deep(.el-card__header) {
  padding: 20px 20px 16px 20px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.discount-section :deep(.el-card__body) {
  padding: 20px;
}

.discount-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.coupon-selection {
  width: 100%;
}

.coupon-option {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.coupon-name {
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.coupon-discount {
  font-weight: 500;
  color: var(--el-color-success);
}

.coupon-validity {
  font-size: 12px;
  color: var(--el-text-color-regular);
}

.selected-coupon-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.coupon-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  font-size: 14px;
}

.coupon-description {
  font-size: 13px;
  color: var(--el-text-color-regular);
  line-height: 1.4;
}

.no-coupon-info {
  text-align: center;
  padding: 16px;
  background: var(--el-fill-color-light);
  border-radius: 6px;
  border: 1px dashed var(--el-border-color);
}

.available-coupons {
  margin-top: 20px;
}

.available-coupons h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.coupon-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.coupon-card {
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.coupon-card:hover {
  border-color: var(--el-color-primary);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
}

.coupon-card.selected {
  border-color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}

.coupon-card.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.coupon-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.coupon-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.coupon-validity {
  font-size: 12px;
  color: var(--el-text-color-regular);
}

.no-coupons {
  text-align: center;
  padding: 40px 20px;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .discount-section :deep(.el-card__body) {
    padding: 16px;
  }
  
  .coupon-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .coupon-card {
    padding: 12px;
  }
}
</style>
