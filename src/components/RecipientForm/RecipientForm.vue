<template>
  <el-card class="recipient-form">
    <template #header>
      <h3>收件人資訊</h3>
    </template>
    
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      class="recipient-form-content"
    >
      <!-- Recipient Name -->
      <el-form-item label="收件人姓名" prop="name">
        <el-input
          v-model="formData.name"
          placeholder="請輸入收件人姓名"
          clearable
          maxlength="20"
          show-word-limit
          @blur="validateField('name')"
        />
      </el-form-item>
      
      <!-- Recipient Phone -->
      <el-form-item label="收件人電話" prop="phone">
        <el-input
          v-model="formData.phone"
          placeholder="請輸入手機號碼 (09xxxxxxxx)"
          clearable
          maxlength="10"
          show-word-limit
          @blur="validateField('phone')"
        >
          <template #prefix>
            <el-icon><Phone /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      
      <!-- Email -->
      <el-form-item label="電子郵件" prop="email">
        <el-input
          v-model="formData.email"
          placeholder="請輸入電子郵件"
          clearable
          @blur="validateField('email')"
        >
          <template #prefix>
            <el-icon><Message /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      
      <!-- Shipping Address -->
      <el-form-item :label="addressLabel" prop="address">
        <el-input
          v-model="formData.address"
          type="textarea"
          :rows="3"
          :placeholder="addressPlaceholder"
          maxlength="200"
          show-word-limit
          @blur="validateField('address')"
        />
      </el-form-item>
      
      <!-- Remarks -->
      <el-form-item label="備註" prop="remarks">
        <el-input
          v-model="formData.remarks"
          type="textarea"
          :rows="2"
          placeholder="選填，如有特殊需求請在此說明"
          maxlength="500"
          show-word-limit
        />
      </el-form-item>
      
      <!-- Privacy Notice -->
      <div class="privacy-notice">
        <el-text type="info" size="small">
          <el-icon><Lock /></el-icon>
          您的個人資訊將被安全保護，僅用於配送用途
        </el-text>
      </div>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useAccountStore } from '@/stores'
import { 
  ElCard, 
  ElForm, 
  ElFormItem, 
  ElInput, 
  ElIcon, 
  ElText 
} from 'element-plus'
import { Phone, Lock, Message } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

interface Props {
  recipientInfo: {
    name: string
    phone: string
    address: string
    email?: string
    remarks?: string
  }
  selectedShippingMethod?: string
}

interface Emits {
  (e: 'info-updated', info: typeof formData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formRef = ref<FormInstance>()

// Form data
const formData = reactive({
  name: props.recipientInfo.name,
  phone: props.recipientInfo.phone,
  address: props.recipientInfo.address,
  email: props.recipientInfo.email || '',
  remarks: props.recipientInfo.remarks || ''
})

const accountStore = useAccountStore()

// Form validation rules
const formRules: FormRules = {
  name: [
    { required: true, message: '請輸入收件人姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名長度應在 2-20 個字元之間', trigger: 'blur' },
    { pattern: /^[\u4e00-\u9fa5a-zA-Z\s]+$/, message: '姓名只能包含中文、英文和空格', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '請輸入收件人電話', trigger: 'blur' },
    { pattern: /^09\d{8}$/, message: '請輸入正確的手機號碼格式 (09xxxxxxxx)', trigger: 'blur' }
  ],
  address: [
    { required: true, message: '請輸入收件地址', trigger: 'blur' },
    { min: 10, max: 200, message: '地址長度應在 10-200 個字元之間', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '請輸入電子郵件', trigger: 'blur' },
    { type: 'email', message: '請輸入正確的電子郵件格式', trigger: 'blur' }
  ],
  remarks: [
    { max: 500, message: '備註長度不能超過 500 個字元', trigger: 'blur' }
  ]
}

// Dynamic address label based on shipping method
const addressLabel = computed(() => {
  if (props.selectedShippingMethod === 'seven' || props.selectedShippingMethod === 'family') {
    return '收件店家'
  }
  return '收件地址'
})

// Dynamic address placeholder
const addressPlaceholder = computed(() => {
  if (props.selectedShippingMethod === 'seven') {
    return '請選擇 7-11 門市'
  } else if (props.selectedShippingMethod === 'family') {
    return '請選擇全家門市'
  }
  return '請輸入完整的收件地址'
})

// Watch for external recipient info changes
watch(() => props.recipientInfo, (newInfo) => {
  formData.name = newInfo.name
  formData.phone = newInfo.phone
  formData.address = newInfo.address
  formData.email = newInfo.email || accountStore.profile?.email || ''
  formData.remarks = newInfo.remarks || ''
}, { deep: true, immediate: true })

// Init email from AccountStore
onMounted(() => {
  if (!formData.email && accountStore.profile?.email) {
    formData.email = accountStore.profile.email
  }
})

// Watch for form data changes and emit to parent
watch(formData, (newFormData) => {
  emit('info-updated', { ...newFormData })
}, { deep: true })

// Validate specific field
const validateField = async (field: string) => {
  try {
    await formRef.value?.validateField(field)
  } catch (error) {
    console.warn(`Validation error for ${field}:`, error)
  }
}

</script>

<style scoped>
.recipient-form {
  background: var(--el-bg-color);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.recipient-form :deep(.el-card__header) {
  padding: 20px 20px 16px 20px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.recipient-form :deep(.el-card__body) {
  padding: 20px;
}

.recipient-form-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.privacy-notice {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px;
  background: var(--el-fill-color-light);
  border-radius: 6px;
  border: 1px solid var(--el-border-color-lighter);
  margin-top: 16px;
}

/* Form item custom styles */
.recipient-form :deep(.el-form-item__label) {
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.recipient-form :deep(.el-input__wrapper) {
  width: 100%;
}

.recipient-form :deep(.el-textarea__inner) {
  resize: vertical;
  min-height: 80px;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .recipient-form :deep(.el-card__body) {
    padding: 16px;
  }

  .recipient-form-content {
    gap: 16px;
  }

  .recipient-form :deep(.el-form-item) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .recipient-form :deep(.el-form-item__label) {
    width: auto !important;
    padding-right: 0;
    line-height: 1.4;
  }

  .recipient-form :deep(.el-form-item__content) {
    width: 100%;
    margin-left: 0 !important;
  }

  .privacy-notice {
    padding: 10px;
  }
}
</style>
