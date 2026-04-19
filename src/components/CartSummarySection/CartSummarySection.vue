<template>
  <el-card class="cart-summary">
    <template #header>
      <h3>訂單商品</h3>
    </template>
    
    <div class="cart-items" v-if="cartItems.length > 0">
      <div 
        v-for="item in cartItems" 
        :key="item.id"
        class="cart-item"
      >
        <img 
          :src="item.productImage" 
          :alt="item.productName" 
          class="item-image"
          @error="handleImageError"
        >
        <div class="item-details">
          <h4 class="item-name">{{ item.productName }}</h4>
          <div class="sku-attributes" v-if="item.skuAttributes && item.skuAttributes.length > 0">
            <span 
              v-for="attr in item.skuAttributes" 
              :key="attr.keyId"
              class="attribute"
            >
              {{ attr.name }}: {{ attr.value }}
            </span>
          </div>
          <div class="price-quantity">
            <span class="unit-price">NT$ {{ item.unitPrice.toLocaleString() }}</span>
            <span class="quantity">x {{ item.quantity }}</span>
            <span class="subtotal">NT$ {{ (item.unitPrice * item.quantity).toLocaleString() }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="empty-cart" v-else>
      <el-empty description="購物車是空的">
        <el-button type="primary" @click="$router.push('/')">
          去購物
        </el-button>
      </el-empty>
    </div>
    
    <div class="cart-total" v-if="cartItems.length > 0">
      <div class="total-row">
        <span class="label">商品小計</span>
        <span class="value">NT$ {{ subtotal.toLocaleString() }}</span>
      </div>
      <div class="total-row">
        <span class="label">商品數量</span>
        <span class="value">{{ totalQuantity }} 件</span>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElCard, ElEmpty, ElButton } from 'element-plus'
import type { CartItem } from '@/model'

interface Props {
  cartItems: CartItem[]
}

const props = defineProps<Props>()

// Calculate subtotal
const subtotal = computed(() => {
  return props.cartItems.reduce((total, item) => {
    return total + (item.unitPrice * item.quantity)
  }, 0)
})

// Calculate total quantity
const totalQuantity = computed(() => {
  return props.cartItems.reduce((total, item) => {
    return total + item.quantity
  }, 0)
})

// Handle image error
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/shop/placeholder-product.png' // Fallback image
}
</script>

<style scoped>
.cart-summary {
  background: var(--el-bg-color);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.cart-summary :deep(.el-card__header) {
  padding: 20px 20px 16px 20px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.cart-summary :deep(.el-card__body) {
  padding: 20px;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
}

.cart-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: var(--el-bg-color-page);
  border-radius: 8px;
  border: 1px solid var(--el-border-color-lighter);
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0;
}

.item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-name {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  line-height: 1.4;
}

.sku-attributes {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.attribute {
  font-size: 12px;
  color: var(--el-text-color-regular);
  background: var(--el-fill-color-light);
  padding: 2px 6px;
  border-radius: 4px;
}

.price-quantity {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
}

.unit-price {
  color: var(--el-text-color-regular);
}

.quantity {
  color: var(--el-text-color-regular);
}

.subtotal {
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-left: auto;
}

.empty-cart {
  text-align: center;
  padding: 40px 20px;
}

.cart-total {
  border-top: 1px solid var(--el-border-color-lighter);
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.label {
  color: var(--el-text-color-regular);
}

.value {
  font-weight: 500;
  color: var(--el-text-color-primary);
}

/* Mobile responsive */
@media (max-width: 768px) {
  .cart-item {
    flex-direction: column;
    gap: 12px;
    padding: 12px;
  }
  
  .item-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
  
  .price-quantity {
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .subtotal {
    margin-left: 0;
    width: 100%;
    text-align: right;
  }
}
</style>
