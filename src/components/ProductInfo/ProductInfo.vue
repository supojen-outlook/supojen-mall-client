<template>
  <div class="product-info">
    <h1 class="product-name">{{ product.name }}</h1>
    <div class="product-price">NT$ {{ displayPrice.toLocaleString() }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Product, Sku } from '@/model'

interface Props {
  product: Product
  currentSku?: Sku | null
}

const props = defineProps<Props>()

// Calculate display price (use SKU price if available, otherwise product price)
const displayPrice = computed(() => {
  return props.currentSku?.price || props.product.price
})
</script>

<style scoped>
.product-info {
  width: 100%;
}

.product-name {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 12px;
  line-height: 1.3;
}

.product-price {
  font-size: 28px;
  font-weight: bold;
  color: #e60023;
  margin-bottom: 12px;
  padding: 4px 0;
}

/* RWD */
@media (max-width: 768px) {
  .product-name {
    font-size: 20px;
  }
  
  .product-price {
    font-size: 24px;
  }
}
</style>
