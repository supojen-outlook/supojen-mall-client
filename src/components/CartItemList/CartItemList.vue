<template>
  <div class="cart-item-list">
    <div class="cart-header">
      <h2>購物車 ({{ cartItems.length }})</h2>
    </div>
    
    <div class="cart-items" v-if="cartItems.length > 0">
      <div 
        v-for="item in cartItems" 
        :key="item.id"
        class="cart-item"
      >
        <CartItemRow 
          :item="item"
          :discounts="getApplicableDiscounts(item)"
          @quantity-changed="handleQuantityChanged"
          @item-deleted="handleItemDeleted"
          @item-moved="handleItemMoved"
        />
      </div>
    </div>
    
    <div class="empty-cart" v-else>
      <el-empty description="購物車是空的">
        <el-button type="primary" @click="$router.push('/')">
          去購物
        </el-button>
      </el-empty>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElEmpty, ElButton } from 'element-plus'
import type { CartItem, Discount } from '@/model'
import { CartItemRow } from '../CartItemRow'

interface Props {
  cartItems: CartItem[]
  discounts: Discount[]
}

interface Emits {
  (e: 'item-updated'): void
  (e: 'item-deleted'): void
  (e: 'item-moved'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Get applicable discounts for a specific cart item
const getApplicableDiscounts = (item: CartItem): Discount[] => {
  return props.discounts.filter(discount => 
    discount.applicableItems.some(applicableItem => 
      applicableItem.id === item.id
    )
  )
}

// Handle quantity change
const handleQuantityChanged = async () => {
  emit('item-updated')
}

// Handle item deletion
const handleItemDeleted = async () => {
  emit('item-deleted')
}

// Handle item moved to wishlist
const handleItemMoved = async () => {
  emit('item-moved')
}
</script>

<style scoped>
.cart-item-list {
  background: var(--el-bg-color);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.cart-header h2 {
  margin: 0 0 20px 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cart-item {
  padding: 0;
}

.cart-item:last-child {
  border-bottom: none;
}

.empty-cart {
  text-align: center;
  padding: 60px 20px;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .cart-item-list {
    padding: 16px;
  }
  
  .cart-header h2 {
    font-size: 18px;
  }
  
  .cart-items {
    gap: 12px;
  }
}
</style>
