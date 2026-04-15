<template>
  <div class="home-page">
    <!-- 商品展示區域 -->
    <section>
      <div class="container">
        <header class="seo-header">
          <h1>小紅帽精選：工藝陶瓷選物</h1>
          <p>致力於結合傳統工藝與現代生活，呈現極致品質。</p>
        </header>

        <!-- 搜索栏 -->
        <div class="home-search-bar">
          <SearchBar
            size="large"
            placeholder="搜索商品..."
            @search="goToSearch"
          />
        </div>

        <!-- 分类筛选 -->
        <div class="home-category-filter">
          <p class="category-hint">按分類瀏覽商品</p>
          <CategoryFilter
            mode="navigate"
            @select="goToCategory"
          />
        </div>

        <ProductList :rows="3" />
      </div>
    </section>
    
    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import ProductList from '@/components/ProductList'
import { Footer } from '@/components/Footer'
import { SearchBar, CategoryFilter } from '@/components'

const router = useRouter()

// 搜索跳转
const goToSearch = (keyword: string) => {
  router.push({
    path: '/search',
    query: keyword ? { q: keyword } : undefined
  })
}

// 分类跳转（点击叶节点）
const goToCategory = (categoryId: number) => {
  router.push({
    path: '/search',
    query: { category: categoryId }
  })
}
</script>

<style scoped>
/* CSS 變數定義 */
:root {
  --primary-color: #534619;
  --hover-color: #6c5d2f;
  --price-color: #e60023;
  --nav-bg: #534619; 
  --nav-text: #ffdbd1; 
  --max-width: 1200px; 
}

@media (min-width: 1600px) {
  :root { --max-width: 1600px; }
}

.home-page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #fcfcfc;
  font-family: "PingFang TC", "Microsoft JhengHei", sans-serif;
}

section {
  padding: 20px 0;
  display: flex;
  justify-content: center;
}

.container {
  width: 96%;
  max-width: var(--max-width);
  margin: 0 auto;
}

.seo-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px 0;
  border-bottom: 1px solid #eee;
}

.seo-header h1 {
  color: #2c1810;
  font-size: 26px;
  margin-bottom: 8px;
}

.seo-header p {
  color: #666;
  font-size: 16px;
  margin: 0;
}

/* 首页搜索栏样式 */
.home-search-bar {
  max-width: 600px;
  margin: 0 auto 40px;
  padding: 0 16px;
}

/* 首页分类筛选 */
.home-category-filter {
  max-width: 1200px;
  margin: 0 auto 40px;
  padding: 0 16px;
  padding-top: 20px;
}

@media (min-width: 1600px) {
  .home-category-filter {
    max-width: 1600px;
  }
}

.category-hint {
  color: #666;
  font-size: 14px;
  margin: 0 0 0 0;
  opacity: 0.8;
  padding-bottom: 0;
  border-bottom: 1px solid #eee;
}
</style>