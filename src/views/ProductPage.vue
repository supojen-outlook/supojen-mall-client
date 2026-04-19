<template>
  <div class="product-page">
    <div class="loading" v-if="loading" v-loading="loading">
      <span>載入中...</span>
    </div>
    
    <div class="error" v-else-if="error">
      <el-result
        icon="error"
        title="Product Not Found"
        :sub-title="error"
      >
        <template #extra>
          <el-button type="primary" @click="$router.push('/')">
            Back to Home
          </el-button>
        </template>
      </el-result>
    </div>
    
    <div class="product-container" v-else-if="product">
      <!-- Back Button -->
      <div class="back-section">
        <el-button 
          @click="goBack"
          class="back-button"
          :icon="ArrowLeft"
          text
        >
          返回
        </el-button>
      </div>
      
      <div class="product-main">
        <!-- Left: Product Images -->
        <div class="product-images-section">
          <ProductImageGallery 
            :main-image="product.mainImageUrl"
            :detail-images="product.detailImages"
            :product-name="product.name"
          />
        </div>
        
        <!-- Right: Product Info -->
        <div class="product-info-section">
          <div class="product-info-content">
            <ProductInfo 
              :product="product"
              :current-sku="currentSku"
            />
            
            <!-- Product Tags -->
            <div class="product-tags" v-if="product.tags && product.tags.length > 0">
              <div class="tags-list">
                <el-tag 
                  v-for="tag in product.tags" 
                  :key="tag"
                  class="tag-item"
                  :style="{
                    backgroundColor: 'var(--el-tertiary-container-color)',
                    color: 'var(--el-tertiary-on-container-color)',
                    border: 'none'
                  }"
                >
                  {{ tag }}
                </el-tag>
              </div>
            </div>
            
            <!-- SKU Selection -->
            <SkuSelector 
              :skus="skus"
              v-model="selectedSkuId"
            />
            
            <!-- Quantity Selector -->
            <div class="quantity-selector">
              <label class="quantity-label">數量</label>
              <el-input-number 
                v-model="quantity"
                :min="1"
                :max="99"
                size="default"
                class="quantity-input"
                :controls="false"
              />
            </div>
          </div>
          
          <!-- Add to Cart Button -->
          <el-button 
            type="primary" 
            size="large" 
            class="add-to-cart"
            :disabled="!currentSku"
            @click="addToCart"
          >
            加入購物車
          </el-button>
        </div>
      </div>
      
      <!-- Product Specifications -->
      <SpecificationDisplay 
        v-if="allSpecifications.length > 0"
        :specs="allSpecifications"
        title="商品屬性"
      />
      
      <!-- Product Description -->
      <div class="product-description" v-if="product.description">
        <div v-html="product.description" class="description-content"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElButton, ElResult, ElTag, ElInputNumber } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { getProduct } from '@/services/Product'
import { getSkus } from '@/services/Sku'
import { addCartItem } from '@/services/CartItem'
import { ElMessage } from 'element-plus'
import type { Product, Sku } from '@/model'
import { ProductImageGallery } from '@/components/ProductImageGallery'
import { ProductInfo } from '@/components/ProductInfo'
import { SkuSelector } from '@/components/SkuSelector'
import { SpecificationDisplay } from '@/components/SpecificationDisplay'

const route = useRoute()

// Reactive state
const loading = ref(true)
const error = ref<string | null>(null)
const product = ref<Product | null>(null)
const skus = ref<Sku[]>([])
const selectedSkuId = ref<number | null>(null)
const quantity = ref(1)

// Get product ID from route
const productId = computed(() => {
  const id = route.params.id
  return typeof id === 'string' ? parseInt(id) : id as unknown as number
})

// Find current SKU based on selection
const currentSku = computed(() => {
  if (!selectedSkuId.value || skus.value.length === 0) return null
  return skus.value.find(sku => sku.id === selectedSkuId.value) || null
})

// Combine product specifications and current SKU specifications
const allSpecifications = computed(() => {
  if (!product.value) return []
  
  const productSpecs = product.value.specs || []
  const skuSpecs = currentSku.value?.specs || []
  
  // Combine and deduplicate specifications
  const allSpecs = [...productSpecs, ...skuSpecs]
  const uniqueSpecs = allSpecs.filter((spec, index, self) => 
    index === self.findIndex(s => s.keyId === spec.keyId)
  )
  
  return uniqueSpecs
})

// Fetch product data
const fetchProductData = async () => {
  try {
    loading.value = true
    error.value = null
    
    // Fetch product details
    const productData = await getProduct(productId.value)
    product.value = productData
    
    // Fetch SKUs for this product
    const skuData = await getSkus({ productId: productId.value })
    skus.value = skuData.list || []
    
    // Set default SKU if only one exists
    if (skus.value.length === 1) {
      selectedSkuId.value = skus.value[0].id
    }
    
  } catch (err) {
    console.error('Failed to fetch product:', err)
    error.value = 'Unable to load product details. Please try again later.'
  } finally {
    loading.value = false
  }
}

// Go back to previous page
const goBack = () => {
  window.history.back()
}

// Add to cart function
const addToCart = async () => {
  if (!currentSku.value) {
    ElMessage.warning('請先選擇商品規格')
    return
  }
  
  try {
    await addCartItem({
      skuId: currentSku.value.id,
      quantity: quantity.value,
      type: 'shopping'
    })
    
    ElMessage.success('成功加入購物車！')
    
    // Optionally, you could navigate to cart or show a success modal
    // router.push('/shopping-cart')
    
  } catch (error) {
    console.error('Failed to add to cart:', error)
    ElMessage.error('加入購物車失敗，請稍後再試。')
  }
}

// Fetch data on component mount
onMounted(fetchProductData)
</script>

<style scoped>
.product-page {
  min-height: 100vh;
  background-color: var(--el-bg-color-page);
  padding: 20px;
}

.loading, .error {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.product-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
}

.product-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;
}

.product-images-section {
  width: 100%;
}

.product-info-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.product-info-content {
  flex: 1;
}

.add-to-cart {
  width: 100%;
  margin-top: auto;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
}

.quantity-selector {
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.quantity-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-regular);
  white-space: nowrap;
}

.quantity-input {
  width: 100px;
}

.product-tags {
  margin-top: 12px;
  margin-bottom: 20px;
}


.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  font-size: 12px;
}

.product-description {
  margin-bottom: 40px;
  border-radius: 6px;
}

.back-section {
  margin-bottom: 12px;
}

.description-content {
  margin-top: 16px;
  line-height: 1.6;
  color: var(--el-text-color-regular);
}

.description-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 8px 0;
}

.description-content :deep(p) {
  margin-bottom: 16px;
}

.description-content :deep(h1), .description-content :deep(h2), .description-content :deep(h3) {
  color: #333;
  margin-bottom: 12px;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .product-container {
    max-width: 100%;
    padding: 16px;
  }
  
  .product-main {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .quantity-selector {
    margin-top: 16px;
  }
  
  .add-to-cart {
    margin-top: 24px;
  }
}
</style>
