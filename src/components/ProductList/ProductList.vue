<!--
  商品列表展示組件
  
  @props rows - 顯示排數，一排6個商品，預設2排
  @example
  <ProductList :rows="3" />  // 顯示3排，共18個商品
  <ProductList />            // 顯示2排，共12個商品（預設）
-->
<template>
  <div class="taobao-product">
    <div class="container">
      <main v-if="loading" class="loading">
        <div>載入中...</div>
      </main>
      <main v-else-if="error" class="error">
        <div>{{ error }}</div>
      </main>
      <main v-else class="product-list">
        <ProductCard 
          v-for="product in products" 
          :key="product.id" 
          :product="product" 
        />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getProducts } from '@/services/Product'
import ProductCard from '../ProductCard'
import type { ProductBase } from '@/model/Product'

interface Props {
  rows?: number  // 排數，一排6個商品，預設2排
}

const props = withDefaults(defineProps<Props>(), {
  rows: 2
})

const products = ref<ProductBase[]>([])
const loading = ref(false)
const error = ref('')

// 根據排數計算要獲取的商品數量
const productCount = computed(() => props.rows * 6)

const fetchProducts = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await getProducts({ size: productCount.value })
    products.value = response.list || []
    console.log('獲取到的商品數據:', products.value)
  } catch (err) {
    console.error('獲取商品失敗:', err)
    error.value = '載入失敗'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.taobao-product {
  padding: 20px 0;
  flex: 1;
  display: flex;
  justify-content: center;
}

.container {
  width: 96%;
  max-width: 1200px;
  margin: 0 auto;
}

@media (min-width: 1600px) {
  .container {
    max-width: 1600px;
  }
}

.product-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin: -6px;
}

.loading, .error {
  text-align: center;
  width: 100%;
  padding: 50px;
  color: #666;
}

.error {
  color: #e60023;
}
</style>
