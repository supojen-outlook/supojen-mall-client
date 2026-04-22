<template>
  <div class="checkout-result-page">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container" v-loading="loading">
      <span>載入中...</span>
    </div>

    <!-- Error State - Order Not Found -->
    <div v-else-if="notFound" class="result-container">
      <el-result
        icon="error"
        title="訂單找不到"
        sub-title="系統無法找到您的訂單資訊，請確認訂單編號或聯繫客服"
      >
        <template #extra>
          <el-button type="primary" @click="goToHome">
            返回首頁
          </el-button>
          <el-button @click="goToOrders">
            查看我的訂單
          </el-button>
        </template>
      </el-result>

      <div class="help-section">
        <el-card class="help-card">
          <template #header>
            <div class="card-header">
              <el-icon><InfoFilled /></el-icon>
              <span>可能的原因</span>
            </div>
          </template>
          <ul class="reason-list">
            <li>訂單編號輸入錯誤或不存在</li>
            <li>訂單尚未完成建立</li>
            <li>系統處理延遲，請稍後再試</li>
            <li>付款過程中發生錯誤</li>
          </ul>
        </el-card>

        <el-card class="help-card">
          <template #header>
            <div class="card-header">
              <el-icon><Service /></el-icon>
              <span>需要協助？</span>
            </div>
          </template>
          <p class="contact-text">
            如果您已經完成付款但無法找到訂單，請聯繫客服：<br>
            <el-link type="primary" href="mailto:support@example.com">support@example.com</el-link>
          </p>
        </el-card>
      </div>
    </div>

    <!-- Success State - Paid -->
    <div v-else-if="isPaid" class="result-container">
      <el-result
        icon="success"
        title="付款成功"
        :sub-title="`訂單編號：${orderNo} 已付款完成`"
      >
        <template #extra>
          <el-button type="primary" @click="goToOrders">
            查看訂單詳情
          </el-button>
          <el-button @click="goToHome">
            繼續購物
          </el-button>
        </template>
      </el-result>

      <div class="order-info-section">
        <el-card class="info-card">
          <template #header>
            <div class="card-header">
              <el-icon><CircleCheck /></el-icon>
              <span>訂單資訊</span>
            </div>
          </template>
          <div class="info-item">
            <span class="label">訂單編號：</span>
            <span class="value">{{ orderNo }}</span>
          </div>
          <div class="info-item">
            <span class="label">訂單狀態：</span>
            <el-tag type="success">已付款</el-tag>
          </div>
          <div class="info-item" v-if="payment?.paidAt">
            <span class="label">付款時間：</span>
            <span class="value">{{ formatTime(payment.paidAt) }}</span>
          </div>
          <div class="info-item" v-if="payment?.amount">
            <span class="label">付款金額：</span>
            <span class="value">NT$ {{ payment.amount.toLocaleString() }}</span>
          </div>
          <div class="info-item" v-if="payment?.method">
            <span class="label">付款方式：</span>
            <span class="value">{{ getPaymentMethodName(payment.method) }}</span>
          </div>
          <!-- ATM 虛擬帳號資訊 -->
          <div v-if="payment?.method === 'atm_virtual' && payment?.bankCode" class="payment-details">
            <el-divider />
            <div class="info-item">
              <span class="label">收款銀行：</span>
              <span class="value">{{ payment.bankCode }}</span>
            </div>
            <div class="info-item" v-if="payment?.codeNo">
              <span class="label">虛擬帳號：</span>
              <span class="value highlight">{{ payment.codeNo }}</span>
            </div>
            <div class="info-item" v-if="payment?.expiredAt">
              <span class="label">付款期限：</span>
              <span class="value">{{ formatTime(payment.expiredAt) }}</span>
            </div>
            <div class="info-item" v-if="payment?.expiredAt">
              <span class="label"></span>
              <span class="value note">請於此日期前完成付款（不包含當天）</span>
            </div>
          </div>
          <!-- 超商代碼資訊 -->
          <div v-if="payment?.method === 'cvs' && payment?.codeNo" class="payment-details">
            <el-divider />
            <div class="info-item">
              <span class="label">繳費代碼：</span>
              <span class="value highlight">{{ payment.codeNo }}</span>
            </div>
            <div class="info-item" v-if="payment?.expiredAt">
              <span class="label">付款期限：</span>
              <span class="value">{{ formatTime(payment.expiredAt) }}</span>
            </div>
            <div class="info-item" v-if="payment?.expiredAt">
              <span class="label"></span>
              <span class="value note">請於此日期前完成付款（不包含當天）</span>
            </div>
          </div>
        </el-card>

        <el-card class="info-card">
          <template #header>
            <div class="card-header">
              <el-icon><Van /></el-icon>
              <span>後續流程</span>
            </div>
          </template>
          <div class="process-flow">
            <div class="flow-item completed">
              <el-icon><CircleCheck /></el-icon>
              <span>下單</span>
            </div>
            <div class="flow-connector"></div>
            <div class="flow-item completed">
              <el-icon><CircleCheck /></el-icon>
              <span>付款</span>
            </div>
            <div class="flow-connector"></div>
            <div class="flow-item active">
              <el-icon><Van /></el-icon>
              <span>出貨</span>
            </div>
            <div class="flow-connector"></div>
            <div class="flow-item pending">
              <span>收貨</span>
            </div>
          </div>
          <p class="notice-text">
            我們將盡快為您處理訂單，出貨後會發送通知至您的電子郵件。
          </p>
        </el-card>
      </div>
    </div>

    <!-- Processing State - Pending -->
    <div v-else class="result-container">
      <el-result
        icon="info"
        title="付款處理中"
        :sub-title="`訂單編號：${orderNo} 正在等待付款確認`"
      >
        <template #icon>
          <el-icon class="processing-icon"><Loading /></el-icon>
        </template>
        <template #extra>
          <el-button type="primary" @click="checkOrderStatus" :loading="checking">
            重新檢查狀態
          </el-button>
          <el-button @click="goToOrders">
            查看訂單列表
          </el-button>
        </template>
      </el-result>

      <div class="order-info-section">
        <!-- Payment Details for Pending State - MOVED TO FRONT -->
        <el-card class="info-card" v-if="payment?.method">
          <template #header>
            <div class="card-header">
              <el-icon><InfoFilled /></el-icon>
              <span>付款資訊</span>
            </div>
          </template>
          <div class="info-item">
            <span class="label">付款方式：</span>
            <span class="value">{{ getPaymentMethodName(payment.method) }}</span>
          </div>
          <div class="info-item" v-if="payment?.amount">
            <span class="label">付款金額：</span>
            <span class="value">NT$ {{ payment.amount.toLocaleString() }}</span>
          </div>
          <!-- ATM 匯款帳號資訊 -->
          <div v-if="payment?.method === 'atm_virtual' && payment?.bankCode" class="payment-details">
            <el-divider />
            <div class="info-item">
              <span class="label">收款銀行：</span>
              <span class="value">{{ payment.bankCode }}</span>
            </div>
            <div class="info-item" v-if="payment?.codeNo">
              <span class="label">匯款帳號：</span>
              <span class="value highlight">{{ payment.codeNo }}</span>
            </div>
            <div class="info-item" v-if="payment?.expiredAt">
              <span class="label">付款期限：</span>
              <span class="value highlight">{{ formatTime(payment.expiredAt) }}</span>
            </div>
            <div class="info-item" v-if="payment?.expiredAt">
              <span class="label"></span>
              <span class="value note">請於此日期前完成付款（不包含當天）</span>
            </div>
          </div>
          <!-- 超商代碼資訊 -->
          <div v-if="payment?.method === 'cvs' && payment?.codeNo" class="payment-details">
            <el-divider />
            <div class="info-item">
              <span class="label">繳費代碼：</span>
              <span class="value highlight">{{ payment.codeNo }}</span>
            </div>
            <div class="info-item" v-if="payment?.expiredAt">
              <span class="label">付款期限：</span>
              <span class="value highlight">{{ formatTime(payment.expiredAt) }}</span>
            </div>
            <div class="info-item" v-if="payment?.expiredAt">
              <span class="label"></span>
              <span class="value note">請於此日期前完成付款（不包含當天）</span>
            </div>
          </div>
        </el-card>

        <el-card class="info-card">
          <template #header>
            <div class="card-header">
              <el-icon><Clock /></el-icon>
              <span>處理狀態</span>
            </div>
          </template>
          <div class="status-content">
            <el-timeline>
              <el-timeline-item
                type="success"
                :hollow="true"
              >
                訂單已建立
              </el-timeline-item>
              <el-timeline-item
                type="primary"
                :hollow="true"
              >
                等待付款確認
                <p class="timeline-desc">系統正在確認您的付款，請稍候...</p>
              </el-timeline-item>
              <el-timeline-item type="info">
                準備出貨
                <p class="timeline-desc">付款確認後將進入出貨流程</p>
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-card>

        <el-card class="info-card">
          <template #header>
            <div class="card-header">
              <el-icon><InfoFilled /></el-icon>
              <span>說明</span>
            </div>
          </template>
          <div class="notice-list">
            <div class="notice-item">
              <el-icon><Timer /></el-icon>
              <span>付款確認通常需要 1-5 分鐘</span>
            </div>
            <div class="notice-item">
              <el-icon><Message /></el-icon>
              <span>完成後會發送確認信至您的電子郵件</span>
            </div>
            <div class="notice-item">
              <el-icon><Refresh /></el-icon>
              <span>您可以重新檢查狀態或稍後查看訂單列表</span>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  ElResult,
  ElButton,
  ElCard,
  ElIcon,
  ElTag,
  ElTimeline,
  ElTimelineItem,
  ElLink,
  ElMessage,
  ElDivider
} from 'element-plus'
import {
  CircleCheck,
  Van,
  Loading,
  Clock,
  InfoFilled,
  Timer,
  Message,
  Refresh,
  Service
} from '@element-plus/icons-vue'
import { getOrderPayment } from '@/services/Payment'
import type { Payment, PaymentMethod } from '@/model'

const router = useRouter()
const route = useRoute()

const loading = ref(true)
const checking = ref(false)
const payment = ref<Payment | null>(null)
const notFound = ref(false)

const orderId = computed(() => {
  const id = route.query.orderId
  return id ? parseInt(id as string, 10) : 0
})

const orderNo = computed(() => {
  return payment.value?.orderId?.toString() || orderId.value.toString()
})

const isPaid = computed(() => {
  return payment.value?.status === 'paid'
})

const fetchPayment = async () => {
  if (!orderId.value) {
    notFound.value = true
    loading.value = false
    return
  }

  try {
    loading.value = true
    notFound.value = false
    const data = await getOrderPayment(orderId.value)
    payment.value = data
  } catch (err: any) {
    console.error('Failed to fetch payment:', err)
    notFound.value = true
    payment.value = null
  } finally {
    loading.value = false
  }
}

const checkOrderStatus = async () => {
  checking.value = true
  try {
    await fetchPayment()
    ElMessage.success('狀態已更新')
  } catch (err) {
    ElMessage.error('檢查狀態失敗')
  } finally {
    checking.value = false
  }
}

const formatTime = (time: string | null) => {
  if (!time) return ''
  return new Date(time).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const getPaymentMethodName = (method: PaymentMethod): string => {
  const names: Record<PaymentMethod, string> = {
    'credit_card_one_time': '信用卡一次付清',
    'atm_virtual': '匯款帳號',
    'cvs': '超商代碼',
    'taiwan_pay': '台灣Pay',
    'cash': '現金',
    'other': '其他'
  }
  return names[method] || method
}

const goToOrders = () => {
  router.push('/my-orders')
}

const goToHome = () => {
  router.push('/')
}

onMounted(() => {
  fetchPayment()
})
</script>

<style scoped>
.checkout-result-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background-color: var(--el-bg-color-page);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 60px;
}

.result-container {
  max-width: 600px;
  width: 100%;
}

.processing-icon {
  font-size: 60px;
  color: var(--el-color-primary);
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.order-info-section,
.help-section {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-card,
.help-card {
  --el-card-padding: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  line-height: 1.5;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-item .label {
  color: var(--el-text-color-secondary);
  min-width: 80px;
}

.info-item .value {
  color: var(--el-text-color-primary);
  font-weight: 500;
}

.process-flow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px 0;
}

.flow-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.flow-item.completed {
  color: var(--el-color-success);
}

.flow-item.active {
  color: var(--el-color-primary);
  font-weight: 600;
}

.flow-item.pending {
  color: var(--el-text-color-placeholder);
}

.flow-item .el-icon {
  font-size: 20px;
}

.flow-connector {
  width: 30px;
  height: 2px;
  background-color: var(--el-border-color);
}

.flow-connector::before {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  background-color: var(--el-color-success);
}

.notice-text {
  margin: 20px 0 0 0;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-light);
  color: var(--el-text-color-secondary);
  text-align: center;
  font-size: 14px;
}

.payment-details {
  margin-top: 12px;
}

.payment-details .highlight {
  color: var(--el-color-primary);
  font-weight: 600;
  font-size: 18px;
  letter-spacing: 1px;
}

.payment-details .note {
  color: var(--el-color-warning);
  font-size: 12px;
  font-style: italic;
}

.reason-list {
  margin: 0;
  padding-left: 20px;
  line-height: 1.8;
  color: var(--el-text-color-regular);
}

.contact-text {
  margin: 0;
  line-height: 1.8;
  color: var(--el-text-color-regular);
}

.status-content {
  padding: 10px 0;
}

.timeline-desc {
  margin: 4px 0 0 0;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.notice-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notice-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--el-text-color-regular);
}

@media (max-width: 768px) {
  .checkout-result-page {
    padding: 20px 16px;
  }

  :deep(.el-result__title) {
    font-size: 20px;
  }

  :deep(.el-result__subtitle) {
    font-size: 14px;
  }
}
</style>
