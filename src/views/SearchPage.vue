<!--
  搜尋/商品列表頁面
  
  路由：/search?q={keyword}&category={id}
  
  功能：
  - 從 URL 讀取 q 參數作為搜尋關鍵字（可選）
  - 從 URL 讀取 category 參數作為分類篩選（可選）
  - 無關鍵字時顯示所有商品
  - 有關鍵字時顯示搜尋結果
  - 支援分類篩選
  - 支援下滑載入更多
-->
<template>
  <div class="search-page">
    <div class="search-container">
      <!-- 搜尋欄 -->
      <div class="search-bar-section">
        <SearchBar 
          v-model="inputKeyword"
          size="large"
          placeholder="搜尋商品名稱、描述..."
          @search="handleSearch"
        />
      </div>

      <!-- 分類篩選 -->
      <div class="category-filter-section">
        <CategoryFilter
          :initial-category-id="initialCategoryId"
          mode="filter"
          @select="handleCategorySelect"
          @navigate="handleCategoryNavigate"
        />
      </div>

      <!-- 商品列表（搜尋結果或所有商品） -->
      <div class="search-result-section">
        <SearchProductList 
          :search-keyword="activeKeyword" 
          :category-id="activeCategoryId"
          :page-size="18" 
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { SearchBar, SearchProductList, CategoryFilter } from '@/components'

const route = useRoute()
const router = useRouter()

// 搜尋欄輸入的文字（實時更新）
const inputKeyword = ref('')
// 實際用於搜尋的關鍵字（只在按下 Enter 或按鈕時更新）
const activeKeyword = ref('')
// 分類相關
const initialCategoryId = ref<number | undefined>(undefined)
const activeCategoryId = ref<number | undefined>(undefined)

// 從 URL 讀取參數
const loadParamsFromUrl = () => {
  const q = route.query.q as string
  if (q) {
    inputKeyword.value = q
    activeKeyword.value = q
  }
  
  const category = route.query.category as string
  if (category) {
    const categoryId = parseInt(category, 10)
    initialCategoryId.value = categoryId
    activeCategoryId.value = categoryId
  }
}

// 處理搜尋（按下 Enter 或點擊按鈕時觸發）
const handleSearch = (searchKeyword: string) => {
  activeKeyword.value = searchKeyword
  // 更新 URL
  const query: any = {}
  if (searchKeyword) query.q = searchKeyword
  if (activeCategoryId.value) query.category = activeCategoryId.value
  router.push({
    path: '/search',
    query: Object.keys(query).length > 0 ? query : undefined
  })
}

// 處理分類選擇（只有葉節點會觸發）
const handleCategorySelect = (categoryId: number) => {
  activeCategoryId.value = categoryId
  // 更新 URL
  const query: any = {}
  if (activeKeyword.value) query.q = activeKeyword.value
  if (categoryId) query.category = categoryId
  router.push({
    path: '/search',
    query: Object.keys(query).length > 0 ? query : undefined
  })
}

// 處理分類導航（面包屑導航時觸發）
const handleCategoryNavigate = (breadcrumb: any[]) => {
  if (breadcrumb.length === 0) {
    // 回到根級別，清除分類篩選
    activeCategoryId.value = undefined
    initialCategoryId.value = undefined
    // 同步 activeKeyword 為 inputKeyword（搜索欄當前值）
    activeKeyword.value = inputKeyword.value
    // 更新 URL，只保留搜索關鍵字
    const query: any = {}
    if (inputKeyword.value) query.q = inputKeyword.value
    router.push({
      path: '/search',
      query: Object.keys(query).length > 0 ? query : undefined
    })
  }
}

// 監聽 URL 變化
watch(() => route.query.q, (newQ) => {
  const q = newQ as string
  if (q !== inputKeyword.value) {
    inputKeyword.value = q || ''
    activeKeyword.value = q || ''
  }
})

watch(() => route.query.category, (newCategory) => {
  const categoryId = newCategory ? parseInt(newCategory as string, 10) : undefined
  if (categoryId !== activeCategoryId.value) {
    initialCategoryId.value = categoryId
    activeCategoryId.value = categoryId
  }
})

onMounted(() => {
  loadParamsFromUrl()
})
</script>

<style scoped>
.search-page {
  min-height: 100vh;
  background-color: var(--el-bg-color-page);
  padding: 20px;
}

.search-container {
  max-width: 1200px;
  margin: 0 auto;
}

@media (min-width: 1600px) {
  .search-container {
    max-width: 1600px;
  }
}

.search-bar-section {
  margin-bottom: 24px;
  padding: 0 8px;
}

.search-bar-section :deep(.search-bar) {
  max-width: 600px;
  margin: 0 auto;
}

.category-filter-section {
  margin-bottom: 24px;
  padding: 0 16px;
}

.search-result-section {
  padding: 0 8px;
}
</style>
