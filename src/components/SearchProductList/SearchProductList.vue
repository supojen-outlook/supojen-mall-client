<!--
  搜尋結果商品列表組件
  
  @props searchKeyword - 搜尋關鍵字（必填）
  @props pageSize - 每頁商品數量，預設 18
  
  功能：
  - 使用 getProducts API 進行搜尋
  - 游標分頁，下滑載入更多
  - 顯示搜尋結果數量
  - 空結果提示
-->
<template>
  <div class="search-product-list">
    <!-- 結果標題 -->
    <div class="search-header">
      <h3 class="search-title">
        {{ searchKeyword ? `搜尋結果："${searchKeyword}"` : '所有商品' }}
      </h3>
      <p v-if="totalCount > 0" class="search-count">
        共 {{ totalCount }} 件商品
      </p>
    </div>

    <!-- 載入中 -->
    <div v-if="loading && products.length === 0" class="loading-container">
      <div class="skeleton-grid">
        <div
          v-for="i in pageSize"
          :key="i"
          class="skeleton-item"
        >
          <el-skeleton animated>
            <template #template>
              <el-skeleton-item variant="image" style="width: 100%; height: 200px" />
              <el-skeleton-item variant="text" style="width: 70%; margin-top: 12px" />
              <el-skeleton-item variant="text" style="width: 50%; margin-top: 8px" />
            </template>
          </el-skeleton>
        </div>
      </div>
    </div>

    <!-- 商品列表 -->
    <div v-else-if="products.length > 0" class="product-grid">
      <ProductCard 
        v-for="product in products" 
        :key="product.id" 
        :product="product" 
      />
      
      <!-- 載入更多 -->
      <div v-if="hasMore" class="load-more-container">
        <el-button
          v-if="!loadingMore"
          text
          type="primary"
          @click="loadMore"
        >
          載入更多
        </el-button>
        <el-button v-else text loading>載入中...</el-button>
      </div>
    </div>

    <!-- 空結果 -->
    <div v-else class="empty-result">
      <el-result icon="info" title="找不到相關商品">
        <template #sub-title>
          <p>試試其他關鍵字，或檢查拼字是否正確</p>
          <p class="search-tips">
            建議搜尋：手機、衣服、鞋子、家電...
          </p>
        </template>
      </el-result>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { ElSkeleton, ElSkeletonItem, ElButton, ElResult } from 'element-plus'
import ProductCard from '../ProductCard'
import { getProducts } from '@/services/Product'
import type { ProductBase } from '@/model/Product'

interface Props {
  searchKeyword?: string
  categoryId?: number
  pageSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  searchKeyword: '',
  pageSize: 18
})

// State
const products = ref<ProductBase[]>([])
const loading = ref(false)
const loadingMore = ref(false)
const cursor = ref<string | null>(null)
const hasMore = ref(true)
const totalCount = ref(0)

// 初始載入
const loadProducts = async () => {
  loading.value = true
  try {
    const params: any = { size: props.pageSize }
    if (props.searchKeyword.trim()) {
      params.search = props.searchKeyword
    }
    if (props.categoryId) {
      params.categoryId = props.categoryId
    }
    const response = await getProducts(params)
    products.value = response.list || []
    cursor.value = response.cursor
    hasMore.value = response.cursor !== null
    // 累積計算總數（游標分頁沒有總數，用已載入數量估算）
    totalCount.value = products.value.length + (hasMore.value ? 1 : 0)
  } catch (err) {
    console.error('搜尋失敗:', err)
  } finally {
    loading.value = false
  }
}

// 載入更多
const loadMore = async () => {
  if (!cursor.value || loadingMore.value) return
  
  loadingMore.value = true
  try {
    const params: any = { size: props.pageSize, cursor: cursor.value }
    if (props.searchKeyword.trim()) {
      params.search = props.searchKeyword
    }
    if (props.categoryId) {
      params.categoryId = props.categoryId
    }
    const response = await getProducts(params)
    products.value.push(...(response.list || []))
    cursor.value = response.cursor
    hasMore.value = response.cursor !== null
    totalCount.value = products.value.length + (hasMore.value ? 1 : 0)
  } catch (err) {
    console.error('載入更多失敗:', err)
  } finally {
    loadingMore.value = false
  }
}

// 監聽搜尋關鍵字變化
watch(() => props.searchKeyword, () => {
  products.value = []
  cursor.value = null
  hasMore.value = true
  loadProducts()
})

// 監聽分類變化
watch(() => props.categoryId, () => {
  products.value = []
  cursor.value = null
  hasMore.value = true
  loadProducts()
})

onMounted(() => {
  loadProducts()
})
</script>

<style scoped>
.search-product-list {
  width: 100%;
}

.search-header {
  margin-bottom: 20px;
  padding: 0 8px;
}

.search-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin: 0 0 8px 0;
}

.search-count {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin: 0;
}

.loading-container {
  padding: 20px 0;
}

.skeleton-grid {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin: -8px;
}

.skeleton-item {
  width: calc(16.666% - 16px);
  margin: 8px;
  flex-shrink: 0;
}

@media (max-width: 1600px) {
  .skeleton-item {
    width: calc(16.666% - 16px);
  }
}

@media (max-width: 1200px) {
  .skeleton-item {
    width: calc(20% - 16px);
  }
}

@media (max-width: 992px) {
  .skeleton-item {
    width: calc(25% - 16px);
  }
}

@media (max-width: 768px) {
  .skeleton-item {
    width: calc(33.333% - 16px);
  }
}

@media (max-width: 480px) {
  .skeleton-item {
    width: calc(50% - 16px);
  }
}

.product-grid {
  display: flex;
  flex-wrap: wrap;
  margin: -8px;
}

.load-more-container {
  width: 100%;
  text-align: center;
  padding: 32px 0;
}

.empty-result {
  padding: 60px 20px;
}

.search-tips {
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-top: 12px;
}
</style>
