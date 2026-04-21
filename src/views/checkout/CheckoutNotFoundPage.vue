<template>
  <div class="checkout-result-page">
    <div class="result-container">
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
              <el-icon><Info-Filled /></el-icon>
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
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ElResult, ElButton, ElCard, ElLink, ElIcon } from 'element-plus'
import { InfoFilled, Service } from '@element-plus/icons-vue'

const router = useRouter()

const goToHome = () => {
  router.push('/')
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

.help-section {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.help-card {
  --el-card-padding: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
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
