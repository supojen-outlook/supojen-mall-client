<template>
  <div class="checkout-result-page">
    <div class="result-container">
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
                icon="Check"
                :hollow="true"
              >
                訂單已建立
              </el-timeline-item>
              <el-timeline-item
                type="primary"
                icon="Loading"
                :hollow="true"
              >
                等待付款確認
                <p class="timeline-desc">系統正在確認您的付款，請稍候...</p>
              </el-timeline-item>
              <el-timeline-item
                type="info"
                icon="Box"
              >
                準備出貨
                <p class="timeline-desc">付款確認後將進入出貨流程</p>
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-card>
        
        <el-card class="info-card">
          <template #header>
            <div class="card-header">
              <el-icon><Info-Filled /></el-icon>
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
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElResult, ElButton, ElCard, ElIcon, ElTimeline, ElTimelineItem, ElMessage } from 'element-plus'
import { Loading, Clock, InfoFilled, Timer, Message, Refresh } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const orderNo = computed(() => route.query.orderNo as string || '')
const checking = ref(false)

const checkOrderStatus = () => {
  checking.value = true
  // 模擬檢查狀態，實際應該呼叫 API
  setTimeout(() => {
    checking.value = false
    ElMessage.info('正在處理中，請稍後再試')
  }, 1500)
}

const goToOrders = () => {
  router.push('/my-orders')
}
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

.order-info-section {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-card {
  --el-card-padding: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
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
