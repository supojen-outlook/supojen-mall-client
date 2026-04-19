<template>
  <div class="cart-item-row">
    <!-- Left Section: Image -->
    <div class="left-section">
      <div class="product-image" @click="goToProduct">
        <img 
          :src="item.productImage || '/shop/placeholder-product.png'" 
          :alt="item.productName"
          @error="handleImageError"
          class="product-img"
        >
      </div>
    </div>
    
    <!-- Middle Section: Product Info -->
    <div class="product-section">
      <div class="product-name" @click="goToProduct">
        {{ item.productName }}
      </div>
      <!-- SKU Specifications -->
      <div class="sku-specs" v-if="item.skuAttributes && item.skuAttributes.length > 0">
        <span 
          v-for="spec in item.skuAttributes" 
          :key="spec.keyId"
          class="spec-tag"
        >
          {{ spec.name }}: {{ spec.value }}
        </span>
      </div>
      <div class="product-price">
        ${{ item.unitPrice.toLocaleString() }}
      </div>
    </div>
    
    <!-- Right Section: Quantity Control + Actions -->
    <div class="right-section">
      <div class="quantity-control">
        <button 
          class="qty-btn minus"
          @click="decreaseQuantity"
          :disabled="quantity <= 1"
        >
          −
        </button>
        <span class="qty-value">{{ quantity }}</span>
        <button 
          class="qty-btn plus"
          @click="increaseQuantity"
          :disabled="quantity >= 99"
        >
          +
        </button>
      </div>
      <!-- Action Buttons (Same row, below quantity) -->
      <div class="action-buttons">
        <el-button 
          text
          @click="moveToWishlist"
          class="action-text-btn"
        >
          追蹤
        </el-button>
        <el-button 
          text
          type="danger"
          @click="deleteItem"
          class="action-text-btn"
        >
          刪除
        </el-button>
      </div>
    </div>
    
    <!-- Bottom Section: Discount Info (full width) -->
    <div class="discount-section" v-if="discounts.length > 0">
      <div class="discount-info">
        <el-icon class="discount-icon"><InfoFilled /></el-icon>
        <span class="discount-text">{{ getDiscountText() }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElButton, ElMessageBox, ElIcon } from 'element-plus'
import { InfoFilled } from '@element-plus/icons-vue'
import { updateCartItem, deleteCartItem, addCartItem } from '@/services/CartItem'
import type { CartItem, Discount } from '@/model'

interface Props {
  item: CartItem
  discounts: Discount[]
}

interface Emits {
  (e: 'quantity-changed'): void
  (e: 'item-deleted'): void
  (e: 'item-moved'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const router = useRouter()

// Local quantity state
const quantity = ref(props.item.quantity)

// Handle image error
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/shop/placeholder-product.png'
}

// Go to product page
const goToProduct = () => {
  router.push(`/product/${props.item.productId}`)
}

// Increase quantity
const increaseQuantity = async () => {
  if (quantity.value >= 99) return
  quantity.value++
  await updateQuantity()
}

// Decrease quantity
const decreaseQuantity = async () => {
  if (quantity.value <= 1) return
  quantity.value--
  await updateQuantity()
}

// Update quantity API call
const updateQuantity = async () => {
  try {
    await updateCartItem({
      id: props.item.id,
      quantity: quantity.value,
      type: 'shopping'
    })
    emit('quantity-changed')
  } catch (error) {
    console.error('Failed to update quantity:', error)
    // Revert quantity on error
    quantity.value = props.item.quantity
  }
}

// Get discount text for display
const getDiscountText = () => {
  // Check if any discount applies to this item
  const applicableDiscounts = props.discounts.filter(discount => 
    discount.applicableItems.some(applicableItem => 
      applicableItem.id === props.item.id
    )
  )
  
  if (applicableDiscounts.length === 0) {
    // Show not eligible message
    const fullReduction = props.discounts.find(d => d.ruleType === 'full_reduction')
    if (fullReduction && fullReduction.threshold > 0) {
      const gap = fullReduction.threshold - (props.item.unitPrice * quantity.value)
      if (gap > 0) {
        return `未符合 滿$${fullReduction.threshold}折$${fullReduction.discountAmount} (還差$${Math.ceil(gap)})`
      }
    }
    return '未符合任何優惠'
  }
  
  // Return the first applicable discount
  const discount = applicableDiscounts[0]
  if (discount.ruleType === 'full_reduction') {
    return `已符合 滿$${discount.threshold}折$${discount.discountAmount}`
  }
  return discount.tabName
}

// Move to wishlist
const moveToWishlist = async () => {
  try {
    await ElMessageBox.confirm(
      '確定要將此商品移到願望清單嗎？',
      '移到願望清單',
      {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'info',
      }
    )
    
    // Add to wishlist
    await addCartItem({
      skuId: props.item.skuId || props.item.productId,
      quantity: props.item.quantity,
      type: 'wishlist'
    })
    
    // Remove from shopping cart
    await deleteCartItem({
      id: props.item.id,
      type: 'shopping'
    })
    
    emit('item-moved')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Failed to move to wishlist:', error)
    }
  }
}

// Delete item
const deleteItem = async () => {
  try {
    await ElMessageBox.confirm(
      '確定要刪除此商品嗎？',
      '刪除商品',
      {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    await deleteCartItem({
      id: props.item.id,
      type: 'shopping'
    })
    emit('item-deleted')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Failed to delete item:', error)
    }
  }
}
</script>

<style scoped>
.cart-item-row {
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  grid-template-rows: auto auto;
  gap: 12px;
  align-items: start;
  padding: 8px;
  border-bottom: 2px solid var(--el-surface-container);
}

/* Left Section: Checkbox + Image */
.left-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.item-checkbox {
  margin: 0;
}

.product-image {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
}

.product-img:hover {
  transform: scale(1.05);
}

/* Product Section: Name + Specs + Price */
.product-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.product-name {
  font-size: 16px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  cursor: pointer;
  transition: color 0.2s;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.4;
}

.product-name:hover {
  color: var(--el-color-primary);
}

/* SKU Specifications */
.sku-specs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 4px 0;
}

.spec-tag {
  font-size: 12px;
  color: var(--el-text-color-regular);
  background: var(--el-fill-color-lighter);
  padding: 2px 8px;
  border-radius: 4px;
}

.product-price {
  font-size: 18px;
  font-weight: 700;
  color: #ff0000;
}

/* Right Section: Quantity + Actions */
.right-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.quantity-control {
  display: flex;
  align-items: center;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  overflow: hidden;
}

.qty-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: var(--el-bg-color);
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  color: #000;
}

.qty-btn:hover:not(:disabled) {
  background: var(--el-fill-color-light);
}

.qty-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.qty-value {
  width: 40px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  color: #000;
  background: #fff;
  border-left: 1px solid var(--el-border-color);
  border-right: 1px solid var(--el-border-color);
}

/* Action Buttons (Same row) */
.action-buttons {
  display: flex;
  gap: 12px;
  align-items: center;
}

.action-text-btn {
  font-size: 13px;
  padding: 2px 4px;
}

/* Discount Section (Full Width) */
.discount-section {
  grid-column: 1 / -1;
  margin-top: 8px;
}

.discount-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--el-text-color-regular);
}

.discount-icon {
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.discount-text {
  color: #666;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .cart-item-row {
    grid-template-columns: auto 1fr auto;
    gap: 8px;
  }
  
  .left-section {
    gap: 8px;
  }
  
  .product-image {
    width: 60px;
    height: 60px;
  }
  
  .product-name {
    font-size: 14px;
  }
  
  .product-price {
    font-size: 16px;
  }
  
  /* SKU Specs - Mobile improvements */
  .sku-specs {
    gap: 4px;
    margin: 2px 0;
  }
  
  .spec-tag {
    font-size: 11px;
    padding: 1px 6px;
  }
  
  /* Right Section - Mobile */
  .right-section {
    gap: 6px;
  }
  
  .qty-btn {
    width: 28px;
    height: 28px;
    font-size: 14px;
  }
  
  .qty-value {
    width: 36px;
    height: 28px;
    font-size: 13px;
  }
  
  .action-buttons {
    gap: 8px;
  }
  
  .action-text-btn {
    font-size: 12px;
    padding: 0 2px;
  }
}
</style>
