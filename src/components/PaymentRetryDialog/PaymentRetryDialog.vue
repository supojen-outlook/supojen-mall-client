<template>
  <el-dialog
    v-model="dialogVisible"
    title="完成付款"
    :width="dialogWidth"
    :before-close="handleClose"
  >
    <div class="payment-retry-content">
      <el-alert
        title="找不到付款記錄"
        type="warning"
        :closable="false"
        show-icon
        class="alert-section"
      >
        請提供您的電子郵件以繼續此訂單的付款流程。
      </el-alert>

      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="80px"
        class="email-form"
      >
        <el-form-item label="電子郵件" prop="email">
          <el-input
            v-model="formData.email"
            placeholder="請輸入您的電子郵件"
            clearable
            :disabled="submitting"
          >
            <template #prefix>
              <el-icon><Message /></el-icon>
            </template>
          </el-input>
        </el-form-item>
      </el-form>

      <div class="notice-section">
        <el-text type="info" size="small">
          <el-icon><InfoFilled /></el-icon>
          我們將使用此電子郵件發送付款確認和訂單更新通知。
        </el-text>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button
          type="primary"
          @click="handleConfirm"
          :loading="submitting"
          class="payment-button"
        >
          前往付款
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  ElDialog,
  ElAlert,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElText,
  ElIcon,
  ElMessage
} from 'element-plus'
import { Message, InfoFilled } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { requestNewebPay } from '@/services'

interface Props {
  visible: boolean
  orderId: number
  defaultEmail?: string
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'confirm', params: { orderId: number; email: string }): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formRef = ref<FormInstance>()
const submitting = ref(false)

// Get user email from account store (not used in this component, but kept for consistency)
const userEmail = computed(() => props.defaultEmail || '')

// Responsive dialog width
const dialogWidth = computed(() => {
  if (typeof window !== 'undefined') {
    return window.innerWidth < 768 ? '90%' : '400px'
  }
  return '400px'
})

// Form data
const formData = ref({
  email: props.defaultEmail || userEmail.value
})

// Dialog visibility
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

// Form validation rules
const formRules: FormRules = {
  email: [
    { required: true, message: '請輸入您的電子郵件', trigger: 'blur' },
    { type: 'email', message: '請輸入正確的電子郵件格式', trigger: 'blur' }
  ]
}

// Watch for defaultEmail changes
watch(() => props.defaultEmail, (newEmail) => {
  if (newEmail && !formData.value.email) {
    formData.value.email = newEmail
  }
}, { immediate: true })

// Watch for visibility changes to reset form
watch(() => props.visible, (visible) => {
  if (visible) {
    formData.value.email = props.defaultEmail || ''
  }
})

const handleClose = () => {
  if (!submitting.value) {
    emit('cancel')
    emit('update:visible', false)
  }
}

const handleConfirm = async () => {
  try {
    // Validate form
    await formRef.value?.validate()
    
    submitting.value = true
    
    // Request NewebPay payment
    const newebPayData = await requestNewebPay({
      orderId: props.orderId,
      email: formData.value.email
    })

    // Create and submit form to NewebPay
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = 'https://ccore.newebpay.com/MPG/mpg_gateway'

    const params = {
      MerchantID: newebPayData.merchantID,
      TradeInfo: newebPayData.tradeInfo,
      TradeSha: newebPayData.tradeSha,
      Version: '2.0'
    }

    for (const [key, value] of Object.entries(params)) {
      const input = document.createElement('input')
      input.type = 'hidden'
      input.name = key
      input.value = value
      form.appendChild(input)
    }

    document.body.appendChild(form)
    form.submit()

    // Close dialog after form submission
    emit('confirm', { orderId: props.orderId, email: formData.value.email })
    emit('update:visible', false)

  } catch (error: any) {
    console.error('Payment retry failed:', error)
    ElMessage.error(error.message || '無法啟動付款流程')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.payment-retry-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.alert-section {
  margin-bottom: 8px;
}

.email-form {
  margin: 16px 0;
}

.notice-section {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: var(--el-fill-color-light);
  border-radius: 6px;
  border: 1px solid var(--el-border-color-lighter);
}

.dialog-footer {
  display: flex;
  justify-content: center;
}

.payment-button {
  min-width: 120px;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .payment-retry-content {
    gap: 16px;
  }
  
  .alert-section {
    font-size: 14px;
  }
  
  .email-form {
    margin: 12px 0;
  }
  
  .notice-section {
    padding: 10px;
    font-size: 12px;
  }
  
  .payment-button {
    width: 100%;
    min-width: auto;
  }
}
</style>
