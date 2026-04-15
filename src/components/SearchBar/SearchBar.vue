=<!--
  搜尋欄組件
  
  @props placeholder - 輸入框提示文字
  @props size - 尺寸變體 small | medium | large
  @props autofocus - 是否自動聚焦
  @emits search - 搜尋時觸發，傳入關鍵字
  
  @example
  <SearchBar placeholder="搜尋商品..." size="large" @search="handleSearch" />
  <SearchBar v-model="keyword" />  // 使用 v-model 綁定
-->
<template>
  <div class="search-bar" :class="sizeClass">
    <div class="search-box">
      <input
        v-model="keyword"
        type="text"
        class="search-input"
        :placeholder="placeholder"
        @keyup.enter="handleEnterKey"
        @input="resetConfirmState"
      />
      <button class="search-button" @click="handleButtonClick">
        <el-icon><Search /></el-icon>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElIcon } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

interface Props {
  placeholder?: string
  size?: 'small' | 'medium' | 'large'
  autofocus?: boolean
  modelValue?: string  // 支援 v-model
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '搜尋商品...',
  size: 'medium',
  autofocus: false,
  modelValue: ''
})

const emit = defineEmits<{
  search: [keyword: string]
  'update:modelValue': [keyword: string]
}>()

const keyword = ref(props.modelValue)
const enterPressCount = ref(0)

// 同步 v-model
watch(() => props.modelValue, (newVal) => {
  keyword.value = newVal
})

watch(keyword, (newVal) => {
  emit('update:modelValue', newVal)
})

// 尺寸對應的 class
const sizeClass = computed(() => `search-bar--${props.size}`)

// 重置 Enter 計數
const resetConfirmState = () => {
  enterPressCount.value = 0
}

// 處理 Enter 鍵（需要按兩次）
const handleEnterKey = () => {
  enterPressCount.value++
  
  if (enterPressCount.value >= 2) {
    // 第二次按 Enter，觸發搜尋
    executeSearch()
  }
}

// 處理按鈕點擊（立即搜尋，不需要按兩次）
const handleButtonClick = () => {
  executeSearch()
}

// 執行搜尋
const executeSearch = () => {
  const trimmedKeyword = keyword.value.trim()
  // 清空關鍵字也允許搜尋（顯示所有商品）
  emit('search', trimmedKeyword)
  // 重置狀態
  enterPressCount.value = 0
}
</script>

<style scoped>
.search-bar {
  width: 100%;
}

.search-box {
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 50px;
  padding: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--el-border-color-lighter);
  transition: box-shadow 0.2s ease;
}

.search-box:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.search-box:focus-within {
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.15);
  border-color: var(--el-color-primary-light-7);
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 15px;
  color: var(--el-text-color-primary);
  padding: 10px 16px 10px 20px;
}

.search-input::placeholder {
  color: var(--el-text-color-placeholder);
}

.search-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: var(--el-color-primary);
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.search-button:hover {
  background: var(--el-color-primary-dark-2);
  transform: scale(1.05);
}

.search-button:active {
  transform: scale(0.95);
}

/* 大尺寸變體 */
.search-bar--large .search-box {
  padding: 6px;
}

.search-bar--large .search-input {
  font-size: 16px;
  padding: 12px 16px 12px 24px;
}

.search-bar--large .search-button {
  width: 48px;
  height: 48px;
}

/* 小尺寸變體 */
.search-bar--small .search-input {
  font-size: 14px;
  padding: 6px 12px 6px 16px;
}

.search-bar--small .search-button {
  width: 32px;
  height: 32px;
}
</style>
