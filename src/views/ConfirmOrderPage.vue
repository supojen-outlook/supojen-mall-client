<template>
  <div class="confirm-order-page">
    <div class="loading" v-if="loading" v-loading="loading">
      <span>載入中...</span>
    </div>

    <div class="error" v-else-if="error">
      <el-result
        icon="error"
        title="載入失敗"
        :sub-title="error"
      >
        <template #extra>
          <el-button type="primary" @click="fetchOrderData">
            重新載入
          </el-button>
        </template>
      </el-result>
    </div>
    
    <div class="order-container" v-else>
      <!-- Back Button -->
      <div class="back-section">
        <el-button 
          @click="goBack"
          class="back-button"
          :icon="ArrowLeft"
          text
        >
          返回購物車
        </el-button>
      </div>
      
      <div class="order-main">
        <!-- Left: Order Content -->
        <div class="order-content-section">
          <!-- Cart Summary -->
          <CartSummarySection :cart-items="cartItems" />
          
          <!-- Discount Section -->
          <DiscountSection 
            :coupons="coupons"
            :selected-coupon="selectedCoupon"
            @coupon-selected="handleCouponSelected"
          />
          
          <!-- Payment Method Section -->
          <PaymentMethodSection 
            :selected-method="selectedPaymentMethod"
            @method-selected="handlePaymentMethodSelected"
          />
          
          <!-- Shipping Method Section -->
          <ShippingMethodSection 
            :selected-method="selectedShippingMethod"
            :shipping-fee="shippingFee"
            @method-selected="handleShippingMethodSelected"
          />
          
          <!-- Recipient Form -->
          <RecipientForm 
            :recipient-info="recipientInfo"
            :selected-shipping-method="selectedShippingMethod"
            @info-updated="handleRecipientInfoUpdated"
          />
        </div>
        
        <!-- Right: Order Summary -->
        <div class="order-summary-section">
          <OrderSummary 
            :cart-items="cartItems"
            :selected-coupon="selectedCoupon"
            :shipping-fee="shippingFee"
            :discounts="discounts"
            :recipient-info="recipientInfo"
            :submitting="submitting"
            @confirm-order="handleConfirmOrder"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElResult, ElButton, ElMessage } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { getCartItems } from '@/services/CartItem'
import { getAvailableDiscounts, getAvaliableCoupons } from '@/services/Discount'
import { addOrder } from '@/services/Order'
import { requestNewebPay } from '@/services'
import { useAccountStore } from '@/stores'
import type { CartItem, Discount, Coupon } from '@/model'
import type { PaymentMethod } from '@/model/Payment'
import type { ShipmentMethod } from '@/model/Shipment'

// Import child components
import { CartSummarySection } from '@/components/CartSummarySection'
import { DiscountSection } from '@/components/DiscountSection'
import { PaymentMethodSection } from '@/components/PaymentMethodSection'
import { ShippingMethodSection } from '@/components/ShippingMethodSection'
import { RecipientForm } from '@/components/RecipientForm'
import { OrderSummary } from '@/components/OrderSummary'

// Reactive state
const loading = ref(true)
const error = ref<string | null>(null)
const cartItems = ref<CartItem[]>([])
const discounts = ref<Discount[]>([])
const coupons = ref<Coupon[]>([])
const selectedCoupon = ref<Coupon | null>(null)
const selectedPaymentMethod = ref<PaymentMethod>('credit_card_one_time')
const selectedShippingMethod = ref<ShipmentMethod>('post')
const submitting = ref(false)

const recipientInfo = ref({
  name: '',
  phone: '',
  address: '',
  email: '',
  remarks: ''
})

const accountStore = useAccountStore()

// Computed properties
const shippingFee = computed(() => {
  if (!selectedShippingMethod.value) return 0
  // TODO: Implement proper shipping fee calculation based on method
  return 60 // Default shipping fee
})

const router = useRouter()

// Fetch order data
const fetchOrderData = async () => {
  try {
    loading.value = true
    error.value = null
    
    // Fetch cart items
    const cartData = await getCartItems({ type: 'shopping' })
    cartItems.value = cartData.list || []
    
    // Fetch discounts
    discounts.value = await getAvailableDiscounts()
    
    // Fetch coupons
    coupons.value = await getAvaliableCoupons()
    
  } catch (err) {
    console.error('Failed to fetch order data:', err)
    error.value = '無法載入訂單資料，請稍後再試。'
  } finally {
    loading.value = false
  }
}

// Event handlers
const handleCouponSelected = (coupon: Coupon | null) => {
  selectedCoupon.value = coupon
}

const handlePaymentMethodSelected = (method: PaymentMethod) => {
  selectedPaymentMethod.value = method
}

const handleShippingMethodSelected = (method: ShipmentMethod) => {
  selectedShippingMethod.value = method
}

const handleRecipientInfoUpdated = (info: typeof recipientInfo.value) => {
  recipientInfo.value = info
}

const handleConfirmOrder = async () => {
  try {
    submitting.value = true

    // Call addOrder API to create order
    const order = await addOrder({
      paymentMethod: selectedPaymentMethod.value,
      shippingMethod: selectedShippingMethod.value,
      couponCode: selectedCoupon.value?.couponCode || undefined,
      recipientName: recipientInfo.value.name,
      recipientPhone: recipientInfo.value.phone,
      shippingAddress: recipientInfo.value.address,
      remarks: recipientInfo.value.remarks || undefined
    })

    ElMessage.success('訂單建立成功！')

    // 如果是 NewebPay 付款方式，導向藍新支付
    if (selectedPaymentMethod.value === 'credit_card_one_time') {
      const email = recipientInfo.value.email || accountStore.profile?.email || ''
      const newebPayData = await requestNewebPay({
        orderId: order.id,
        email: email
      })

      // 建立動態表單並提交到藍新
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = 'https://ccore.newebpay.com/MPG/mpg_gateway'

      const params = {
        MerchantID: newebPayData.merchantID,
        TradeInfo: newebPayData.tradeInfo,
        TradeSha: newebPayData.tradeSha,
        Version: '2.0'
      }

      for (const [key, value] of Object.entries(params)) {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = key
        input.value = value
        form.appendChild(input)
      }

      document.body.appendChild(form)
      form.submit()
    } else {
      // 其他付款方式，導向訂單詳情頁
      router.push(`/order/${order.id}/payment`)
    }

  } catch (err:any) {
    console.error('Failed to confirm order:', err)
    ElMessage.error(err.message)
    router.push('/shopping-cart')
  } finally {
    submitting.value = false
  }
}

// Go back to cart page
const goBack = () => {
  router.push('/shopping-cart')
}

// Fetch data on component mount
onMounted(fetchOrderData)
</script>

<style scoped>
.confirm-order-page {
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

.order-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.order-main {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
  margin-top: 20px;
}

.order-content-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.order-summary-section {
  width: 100%;
  position: sticky;
  top: 20px;
  height: fit-content;
}

.back-section {
  margin-bottom: 12px;
}

.back-button {
  font-size: 14px;
  color: var(--el-text-color-regular);
}

/* Mobile responsive */
@media (max-width: 1024px) {
  .order-main {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .order-summary-section {
    position: static;
  }
}

@media (max-width: 768px) {
  .order-container {
    max-width: 100%;
    padding: 16px;
  }
  
  .order-main {
    gap: 20px;
  }
  
  .order-content-section {
    gap: 20px;
  }
}
</style>
