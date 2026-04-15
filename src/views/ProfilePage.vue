<!--
  會員資訊頁面
  
  功能：
  - 顯示用戶基本資訊（頭像、暱稱、會員等級、積分、郵箱）
  - 編輯用戶資料（displayName, fullName, birthDate, gender, avatar）
  - 使用 updateProfile API 儲存修改
-->
<template>
  <div class="profile-page">
    <div class="profile-container">
      <!-- 用戶資訊卡片（只讀） -->
      <div class="user-card">
        <div class="user-card-content">
          <!-- 頭像 -->
          <div class="avatar-section">
            <el-avatar
              :size="100"
              :src="profile?.avatar || defaultAvatar"
              class="user-avatar"
            />
          </div>
          
          <!-- 資訊 -->
          <div class="info-section">
            <h2 class="display-name">{{ profile?.displayName || '未設定暱稱' }}</h2>
            
            <div class="membership-info">
              <el-tag 
                :type="membershipTagType" 
                size="large"
                class="membership-tag"
              >
                {{ membershipLevelText }}
              </el-tag>
              
              <span class="points">
                <el-icon><Trophy /></el-icon>
                {{ formattedPoints }} pts
              </span>
            </div>
            
            <div class="email-section">
              <el-icon><Message /></el-icon>
              <span>{{ profile?.email }}</span>
              <el-tag 
                v-if="!profile?.emailVerified" 
                type="warning" 
                size="small"
                class="verify-tag"
              >
                未驗證
              </el-tag>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 詳細資料表單 -->
      <div class="profile-form-section">
        <div class="form-header">
          <h3>詳細資料</h3>
          <div class="form-actions">
            <template v-if="!isEditing">
              <el-button type="primary" @click="startEditing">
                <el-icon><Edit /></el-icon>
                編輯
              </el-button>
            </template>
            <template v-else>
              <el-button type="success" @click="saveProfile" :loading="saving">
                <el-icon><Check /></el-icon>
                儲存
              </el-button>
              <el-button @click="cancelEditing">
                <el-icon><Close /></el-icon>
                取消
              </el-button>
            </template>
          </div>
        </div>
        
        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-position="right"
          label-width="100px"
          class="profile-form"
          :disabled="!isEditing"
        >
          <!-- 頭像編輯 -->
          <el-form-item label="頭像">
            <AssetUpload
              v-model="formData.avatar"
              accept="image/*"
              :max-size="2"
              placeholder="點擊上傳頭像"
              tip="支援 JPG、PNG 格式，最大 2MB"
              :disabled="!isEditing"
            />
          </el-form-item>
          
          <!-- 顯示名稱 -->
          <el-form-item label="顯示名稱" prop="displayName">
            <el-input
              v-model="formData.displayName"
              placeholder="請輸入顯示名稱"
              maxlength="20"
              show-word-limit
            />
          </el-form-item>
          
          <!-- 真實姓名 -->
          <el-form-item label="真實姓名">
            <el-input
              v-model="formData.fullName"
              placeholder="請輸入真實姓名（選填）"
            />
          </el-form-item>
          
          <!-- 生日 -->
          <el-form-item label="生日">
            <el-date-picker
              v-model="formData.birthDate"
              type="date"
              placeholder="選擇生日"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            />
          </el-form-item>
          
          <!-- 性別 -->
          <el-form-item label="性別">
            <el-radio-group v-model="formData.gender">
              <el-radio label="male">男</el-radio>
              <el-radio label="female">女</el-radio>
              <el-radio label="">不透露</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { Edit, Check, Close, Trophy, Message } from '@element-plus/icons-vue'
import { useAccountStore } from '@/stores'
import { getProfile, updateProfile } from '@/services'
import type { Profile, MembershipLevel } from '@/model'
import AssetUpload from '@/components/AssetUpload/AssetUpload.vue'

// 默認頭像
const defaultAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

// Store
const accountStore = useAccountStore()

// 狀態
const profile = ref<Profile | null>(null)
const isEditing = ref(false)
const saving = ref(false)
const formRef = ref<FormInstance>()

// 表單數據
const formData = ref({
  displayName: '',
  fullName: '',
  birthDate: '',
  gender: '' as string,
  avatar: ''
})

// 會員等級映射
const membershipTextMap: Record<MembershipLevel, string> = {
  bronze: '銅牌會員',
  silver: '銀牌會員',
  gold: '金牌會員',
  vip: 'VIP 會員'
}

// 會員等級標籤樣式
const membershipTagTypeMap: Record<MembershipLevel, string> = {
  bronze: 'info',      // 灰色/棕色
  silver: '',          // 預設藍色
  gold: 'warning',     // 金色
  vip: 'danger'        // 紫色
}

// 計算屬性
const membershipLevelText = computed(() => {
  if (!profile.value?.membershipLevel) return '一般會員'
  return membershipTextMap[profile.value.membershipLevel]
})

const membershipTagType = computed(() => {
  if (!profile.value?.membershipLevel) return 'info'
  return membershipTagTypeMap[profile.value.membershipLevel]
})

const formattedPoints = computed(() => {
  if (!profile.value?.points) return '0'
  return profile.value.points.toLocaleString()
})

// 表單驗證規則
const formRules: FormRules = {
  displayName: [
    { required: true, message: '請輸入顯示名稱', trigger: 'blur' },
    { min: 2, max: 20, message: '長度應在 2 到 20 個字元之間', trigger: 'blur' }
  ]
}

// 載入用戶資料
const loadProfile = async () => {
  try {
    const data = await getProfile()
    profile.value = data
    
    // 同步更新 store
    accountStore.login(data)
    
    // 初始化表單數據
    resetFormData()
  } catch (error) {
    ElMessage.error('載入用戶資料失敗')
    console.error('Load profile error:', error)
  }
}

// 重置表單數據
const resetFormData = () => {
  if (profile.value) {
    formData.value = {
      displayName: profile.value.displayName || '',
      fullName: profile.value.fullName || '',
      birthDate: profile.value.birthDate || '',
      gender: profile.value.gender || '',
      avatar: profile.value.avatar || ''
    }
  }
}

// 開始編輯
const startEditing = () => {
  resetFormData()
  isEditing.value = true
}

// 取消編輯
const cancelEditing = () => {
  isEditing.value = false
  resetFormData()
}

// 儲存資料
const saveProfile = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    
    saving.value = true
    try {
      const updatedProfile = await updateProfile({
        displayName: formData.value.displayName,
        fullName: formData.value.fullName,
        birthDate: formData.value.birthDate,
        gender: formData.value.gender,
        avatar: formData.value.avatar
      })
      
      // 更新本地資料
      profile.value = updatedProfile
      accountStore.login(updatedProfile)
      
      isEditing.value = false
      ElMessage.success('資料更新成功')
    } catch (error) {
      ElMessage.error('更新資料失敗')
      console.error('Update profile error:', error)
    } finally {
      saving.value = false
    }
  })
}

// 頁面載入時獲取資料
onMounted(() => {
  // 優先使用 store 資料初始化
  if (accountStore.profile) {
    profile.value = accountStore.profile
    resetFormData()
  }
  
  // 然後獲取最新資料
  loadProfile()
})
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background-color: var(--el-bg-color-page);
  padding: 40px 20px;
}

.profile-container {
  max-width: 800px;
  margin: 0 auto;
}

/* 用戶資訊卡片 */
.user-card {
  background: white;
  border-radius: 12px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.user-card-content {
  display: flex;
  align-items: center;
  gap: 24px;
}

.avatar-section {
  flex-shrink: 0;
}

.user-avatar {
  border: 3px solid #e4e7ed;
}

.info-section {
  flex: 1;
}

.display-name {
  margin: 0 0 12px 0;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.membership-info {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}

.membership-tag {
  font-size: 14px;
  font-weight: 500;
}

.points {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #f7ba2a;
  font-weight: 500;
  font-size: 16px;
}

.email-section {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #606266;
}

.verify-tag {
  margin-left: 8px;
}

/* 表單區塊 */
.profile-form-section {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e4e7ed;
}

.form-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.form-actions {
  display: flex;
  gap: 12px;
}

.profile-form {
  max-width: 500px;
}


/* RWD */
@media (max-width: 768px) {
  .profile-page {
    padding: 20px 16px;
  }
  
  .user-card {
    padding: 24px;
  }
  
  .user-card-content {
    flex-direction: column;
    text-align: center;
  }
  
  .membership-info {
    justify-content: center;
  }
  
  .email-section {
    justify-content: center;
  }
  
  .profile-form-section {
    padding: 24px;
  }
  
  .form-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
}
</style>
