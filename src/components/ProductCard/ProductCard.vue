<template>
  <a 
    :href="`/product/${product.id}`" 
    class="product-card"
    @click.prevent="$router.push(`/product/${product.id}`)"
  >
    <img 
      :src="product.mainImageUrl || 'https://via.placeholder.com/300?text=商品圖片'" 
      :alt="product.name"
      @error="handleImageError"
    >
    <div class="product-info">
      <div class="product-name">{{ product.name }}</div>
      <div class="product-tags">{{ Array.isArray(product.tags) ? product.tags.join(', ') : '' }}</div>
      <div class="product-price">NT$ {{ product.price.toLocaleString() }}</div>
    </div>
  </a>
</template>

<script setup lang="ts">
import type { ProductBase } from '@/model/Product'

interface Props {
  product: ProductBase
}

const props = defineProps<Props>()

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = 'https://via.placeholder.com/300?text=商品圖片'
}
</script>

<style scoped>
.product-card {
  flex: 0 0 calc(16.666% - 12px);
  max-width: calc(16.666% - 12px);
  margin: 6px;
  text-decoration: none;
  color: inherit;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  display: block;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.product-card img {
  width: 100%;
  aspect-ratio: 1/1;
  object-fit: cover;
  display: block;
  background: #f0f0f0;
  border-radius: 8px;
}

.product-info {
  padding: 6px 6px 8px 6px;
}

.product-name {
  font-size: 15px;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 2px;
  color: #333;
}

.product-tags {
  font-size: 12px;
  color: #6c5d2f;
  margin-bottom: 3px;
  height: 1.2em;
  overflow: hidden;
  white-space: nowrap;
}

.product-price {
  font-size: 18px;
  color: #e60023;
  font-weight: bold;
}

/* RWD */
@media (max-width: 768px) {
  .product-card {
    flex: 0 0 calc(33.33% - 12px);
    max-width: calc(33.33% - 12px);
  }
}

@media (max-width: 500px) {
  .product-card {
    flex: 0 0 calc(50% - 12px);
    max-width: calc(50% - 12px);
  }
}
</style>
