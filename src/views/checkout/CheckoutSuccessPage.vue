<template>
  <div class="checkout-result-page">
    <div class="result-container">
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
              <el-icon><Circle-Check /></el-icon>
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
          <div class="info-item">
            <span class="label">付款時間：</span>
            <span class="value">{{ currentTime }}</span>
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
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElResult, ElButton, ElCard, ElIcon, ElTag } from 'element-plus'
import { CircleCheck, Van } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const orderNo = computed(() => route.query.orderNo as string || '')

const currentTime = computed(() => {
  return new Date().toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
})

const goToOrders = () => {
  router.push('/my-orders')
}

const goToHome = () => {
  router.push('/')
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

.result-container {
  max-width: 600px;
  width: 100%;
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

.notice-text {
  margin: 20px 0 0 0;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-light);
  color: var(--el-text-color-secondary);
  text-align: center;
  font-size: 14px;
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
  
  :deep(.el-steps--simple) {
    padding: 8px;
  }
}
</style>
