<template>
  <div class="my-orders-page">
    <div class="page-header">
      <h2>我的訂單</h2>
      <div class="filter-section">
        <div class="date-filter">
          <span class="filter-label">日期範圍：</span>
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="開始日期"
            end-placeholder="結束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :disabled="loading"
          />
          <el-button
            type="primary"
            :disabled="!isDateRangeValid || loading"
            :loading="loading"
            @click="applyDateFilter"
          >
            搜尋
          </el-button>
          <el-button
            text
            :disabled="!dateRange || loading"
            @click="clearDateFilter"
          >
            清除
          </el-button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && orders.length === 0" class="loading-container">
      <el-skeleton :rows="5" animated />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <el-result icon="error" title="載入失敗" :sub-title="error">
        <template #extra>
          <el-button type="primary" @click="loadOrders">重新載入</el-button>
        </template>
      </el-result>
    </div>

    <!-- Empty State -->
    <div v-else-if="orders.length === 0" class="empty-container">
      <el-empty description="尚無訂單記錄">
        <template #extra>
          <el-button type="primary" @click="goShopping">去購物</el-button>
        </template>
      </el-empty>
    </div>

    <!-- Orders List -->
    <div v-else class="orders-container">
      <div
        v-for="order in orders"
        :key="order.id"
        class="order-card"
        :class="{ expanded: expandedOrderId === order.id }"
      >
        <!-- Order Header (Click to expand) -->
        <div class="order-header" @click="toggleOrder(order.id)">
          <div class="order-main-info">
            <div class="order-info-row">
              <div class="order-number">
                <span class="label">訂單編號：</span>
                <span class="value">{{ order.orderNumber }}</span>
              </div>
              <div class="order-status">
                <el-tag :type="statusTagType(order.status)" size="small">
                  {{ statusText(order.status) }}
                </el-tag>
              </div>
            </div>
            <div class="order-info-row">
              <div class="order-date">
                <span class="label">下單時間：</span>
                <span class="value">{{ formatDate(order.createdAt) }}</span>
              </div>
            </div>
            <div class="order-price-breakdown">
              <div v-if="order.discountAmount > 0" class="price-row discount">
                <span class="label">折扣：</span>
                <span class="value">-NT$ {{ order.discountAmount.toLocaleString() }}</span>
              </div>
              <div class="price-row">
                <span class="label">運費：</span>
                <span class="value">NT$ {{ order.shippingAmount.toLocaleString() }}</span>
              </div>
            </div>
            <div class="order-total-row">
              <span class="label">訂單總額：</span>
              <span class="value price">NT$ {{ order.totalAmount.toLocaleString() }}</span>
            </div>
          </div>
          <div class="expand-icon">
            <el-icon>
              <ArrowDown v-if="expandedOrderId !== order.id" />
              <ArrowUp v-else />
            </el-icon>
          </div>
        </div>

        <!-- Expanded Content -->
        <div v-if="expandedOrderId === order.id" class="order-details">
          <el-divider />

          <!-- Payment Info -->
          <div class="section">
            <h4>付款信息</h4>
            <div v-if="paymentLoading[order.id]" class="section-loading">
              <el-skeleton :rows="1" animated />
            </div>
            <div v-else-if="paymentsMap[order.id]" class="payment-info">
              <div class="payment-row">
                <span class="label">付款方式：</span>
                <span class="value">{{ formatPaymentMethod(paymentsMap[order.id]!.method) }}</span>
              </div>
              <div class="payment-row">
                <span class="label">付款狀態：</span>
                <el-tag :type="paymentStatusTagType(paymentsMap[order.id]!.status)" size="small">
                  {{ paymentStatusText(paymentsMap[order.id]!.status) }}
                </el-tag>
              </div>
              <div v-if="paymentsMap[order.id]!.paidAt" class="payment-row">
                <span class="label">付款時間：</span>
                <span class="value">{{ formatDate(paymentsMap[order.id]!.paidAt) }}</span>
              </div>
              <div class="payment-row">
                <span class="label">付款金額：</span>
                <span class="value price">NT$ {{ paymentsMap[order.id]!.amount.toLocaleString() }}</span>
              </div>
              <div class="payment-actions" v-if="paymentsMap[order.id]!.status === 'pending'">
                <el-button type="primary" size="small" @click="goToCheckout(order.id)">
                  查看付款資訊
                </el-button>
              </div>
            </div>
            <div v-else class="payment-empty">
              <el-text type="info">無付款記錄</el-text>
              <div class="payment-actions">
                <el-button type="primary" size="small" @click="openPaymentRetryDialog(order.id)">
                  重新付款
                </el-button>
              </div>
            </div>
          </div>

          <!-- Order Progress Timeline -->
          <div class="section">
            <h4>訂單進度</h4>
            <div class="progress-timeline">
              <div
                v-for="(step, index) in getOrderProgressSteps(order)"
                :key="step.key"
                class="progress-step"
                :class="{ completed: step.completed, pending: !step.completed }"
              >
                <div class="step-top">
                  <div class="step-dot" />
                  <div v-if="index < 3" class="step-line" :class="{ completed: getOrderProgressSteps(order)[index + 1]?.completed }" />
                </div>
                <div class="step-info">
                  <div class="step-label">{{ step.label }}</div>
                  <div v-if="step.time" class="step-time">{{ step.time }}</div>
                  <div v-else class="step-time pending">-</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Items -->
          <div class="section">
            <h4>訂單商品</h4>
            <div v-if="orderItemsLoading[order.id]" class="section-loading">
              <el-skeleton :rows="2" animated />
            </div>
            <div v-else class="items-list">
              <div
                v-for="item in orderItemsMap[order.id] || []"
                :key="item.id"
                class="item-row"
              >
                <el-image
                  :src="item.productImageUrl || '/shop/placeholder-product.png'"
                  :alt="item.productName"
                  class="item-image"
                  fit="cover"
                />
                <div class="item-info">
                  <div class="item-name">{{ item.productName }}</div>
                  <div class="item-meta">
                    <span class="item-price">NT$ {{ item.unitPrice.toLocaleString() }}</span>
                    <span class="item-quantity">x {{ item.quantity }}</span>
                  </div>
                </div>
                <div class="item-status">
                  <el-tag :type="itemStatusTagType(item.status)" size="small">
                    {{ itemStatusText(item.status) }}
                  </el-tag>
                </div>
              </div>
            </div>
          </div>

          <!-- Shipment Info -->
          <div class="section">
            <h4>物流信息</h4>
            <div v-if="shipmentLoading[order.id]" class="section-loading">
              <el-skeleton :rows="1" animated />
            </div>
            <div v-else-if="shipmentsMap[order.id]" class="shipment-info">
              <div class="shipment-row">
                <span class="label">出貨日期：</span>
                <span class="value">{{ formatDate(shipmentsMap[order.id]!.shipDate) }}</span>
              </div>
              <div class="shipment-row">
                <span class="label">物流方式：</span>
                <span class="value">{{ formatShipmentMethod(shipmentsMap[order.id]!.method) }}</span>
              </div>
              <div v-if="shipmentsMap[order.id]!.trackingNumber" class="shipment-row">
                <span class="label">追蹤編號：</span>
                <span class="value">{{ shipmentsMap[order.id]!.trackingNumber }}</span>
              </div>
              <el-divider class="shipment-divider" />
              <div class="shipment-row">
                <span class="label">收件人：</span>
                <span class="value">{{ shipmentsMap[order.id]!.recipientName }}</span>
              </div>
              <div class="shipment-row">
                <span class="label">聯絡電話：</span>
                <span class="value">{{ shipmentsMap[order.id]!.recipientPhone }}</span>
              </div>
              <div class="shipment-row">
                <span class="label">配送地址：</span>
                <span class="value">{{ shipmentsMap[order.id]!.shippingAddress || '-' }}</span>
              </div>
            </div>
            <div v-else class="shipment-empty">
              <el-text type="info">物流信息暫未更新</el-text>
            </div>
            
            <!-- Shipping Tracking Reminder -->
            <div v-if="shipmentsMap[order.id] && shipmentsMap[order.id]!.trackingNumber" class="tracking-reminder">
              <el-alert
                title="物流查詢提醒"
                type="info"
                :closable="false"
                show-icon
                class="tracking-alert"
              >
                <template #default>
                  <div class="tracking-content">
                    <div class="tracking-info">
                      <span>您的物流追蹤編號：</span>
                      <span class="tracking-number">{{ shipmentsMap[order.id]!.trackingNumber }}</span>
                    </div>
                    <div class="tracking-action">
                      <span>您可以前往以下網站查詢物流進度：</span>
                      <el-link 
                        :href="getTrackingUrl(shipmentsMap[order.id]!.method)" 
                        target="_blank" 
                        type="primary"
                        class="tracking-link"
                      >
                        {{ getTrackingSiteName(shipmentsMap[order.id]!.method) }}
                      </el-link>
                    </div>
                  </div>
                </template>
              </el-alert>
            </div>
            
            <!-- Delivery Confirmation Button -->
            <div v-if="order.status === 'shipped'" class="delivery-confirmation">
              <el-button
                type="success"
                size="small"
                :loading="confirmingDelivery[order.id]"
                @click="confirmDelivery(order.id)"
                class="confirm-delivery-btn"
              >
                確認收貨
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="orders.length > 0" class="pagination-container">
        <el-button
          :disabled="pagination.currentPage === 1 || pagination.isLoading"
          @click="handlePageChange(pagination.currentPage - 1)"
        >
          上一頁
        </el-button>
        <el-button
          :disabled="!pagination.hasMore || pagination.isLoading"
          @click="handlePageChange(pagination.currentPage + 1)"
        >
          下一頁
        </el-button>
      </div>
    </div>
  </div>

  <!-- Payment Retry Dialog -->
  <PaymentRetryDialog
    v-model:visible="showPaymentRetryDialog"
    :order-id="selectedOrderId"
    :default-email="userEmail"
    @confirm="handlePaymentRetry"
    @cancel="handlePaymentRetryCancel"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElSkeleton, ElResult, ElButton, ElEmpty, ElTag, ElIcon, ElDivider, ElText, ElImage, ElDatePicker, ElMessageBox, ElMessage } from 'element-plus'
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import { getMyOrders, getOrderItems, updateOrderShipment } from '@/services/Order'
import { getOrderShipment } from '@/services/Shipment'
import { getOrderPayment } from '@/services/Payment'
import { usePagination } from '@/composables/usePagination'
import { PaymentRetryDialog } from '@/components'
import { useAccountStore } from '@/stores'
import type { Order, OrderItem } from '@/model'
import type { OrderStatus, OrderItemStatus } from '@/model'
import type { Shipment } from '@/model'
import type { Payment, PaymentStatus } from '@/model/Payment'

const router = useRouter()
const accountStore = useAccountStore()

// 日期篩選
const dateRange = ref<[string, string] | null>(null)

// Payment retry dialog state
const showPaymentRetryDialog = ref(false)
const selectedOrderId = ref<number>(0)

// Delivery confirmation state
const confirmingDelivery = ref<Record<number, boolean>>({})

// Get user email from account store
const userEmail = computed(() => accountStore.profile?.email || '')

// 檢查日期範圍是否有效（要么都有，要么都空）
const isDateRangeValid = computed(() => {
  if (!dateRange.value) return true
  const [start, end] = dateRange.value
  return !!start && !!end
})

// 使用 usePagination 管理分頁
const {
  items: orders,
  loading,
  pagination,
  filters,
  loadItems: loadOrders,
  handleCurrentChange,
  handleSearch
} = usePagination<Order, { startDate?: string; endDate?: string }>({
  fetchList: getMyOrders,
  pageSize: 10
})

// State
const error = ref<string | null>(null)
const expandedOrderId = ref<number | null>(null)

// Order items, shipments and payments cache
const orderItemsMap = ref<Record<number, OrderItem[]>>({})
const orderItemsLoading = ref<Record<number, boolean>>({})
const shipmentsMap = ref<Record<number, Shipment | null>>({})
const shipmentLoading = ref<Record<number, boolean>>({})
const paymentsMap = ref<Record<number, Payment | null>>({})
const paymentLoading = ref<Record<number, boolean>>({})

// Status mapping
const statusText = (status: OrderStatus): string => {
  const map: Record<OrderStatus, string> = {
    'created': '待付款',
    'paid': '待出貨',
    'shipped': '運送中',
    'completed': '已完成',
    'closed': '已關閉'
  }
  return map[status]
}

const statusTagType = (status: OrderStatus): any => {
  const map: Record<OrderStatus, any> = {
    'created': 'warning',
    'paid': 'primary',
    'shipped': 'success',
    'completed': 'success',
    'closed': 'info'
  }
  return map[status]
}

const itemStatusText = (status: OrderItemStatus): string => {
  const map: Record<OrderItemStatus, string> = {
    'pending': '待處理',
    'shipped': '已出貨',
    'refunded': '已退貨',
    'cancelled': '已取消'
  }
  return map[status]
}

const itemStatusTagType = (status: OrderItemStatus): any => {
  const map: Record<OrderItemStatus, any> = {
    'pending': 'warning',
    'shipped': 'success',
    'refunded': 'info',
    'cancelled': 'info'
  }
  return map[status]
}

const formatShipmentMethod = (method: string | null): string => {
  const map: Record<string, string> = {
    'post': '郵寄',
    'seven': '7-11 超商取貨',
    'family': '全家超商取貨'
  }
  return map[method || ''] || method || '未知'
}

// Get tracking URL based on shipping method
const getTrackingUrl = (method: string | null): string => {
  const urls: Record<string, string> = {
    'post': 'https://postserv.post.gov.tw/pstmail/main_mail.html',
    'seven': 'https://eservice.7-11.com.tw/E-Tracking/search.aspx',
    'family': 'https://fmec.famiport.com.tw/FP_Entrance/QueryBox'
  }
  return urls[method || ''] || '#'
}

// Get tracking site name based on shipping method
const getTrackingSiteName = (method: string | null): string => {
  const names: Record<string, string> = {
    'post': '中華郵政',
    'seven': '7-11 便利商店',
    'family': '全家便利商店'
  }
  return names[method || ''] || '物流查詢網站'
}

const paymentStatusText = (status: PaymentStatus): string => {
  const map: Record<PaymentStatus, string> = {
    'pending': '等待付款',
    'paid': '已付款',
    'failed': '付款失敗',
    'refunded': '已退款'
  }
  return map[status]
}

const paymentStatusTagType = (status: PaymentStatus): any => {
  const map: Record<PaymentStatus, any> = {
    'pending': 'warning',
    'paid': 'success',
    'failed': 'danger',
    'refunded': 'info'
  }
  return map[status]
}

const formatPaymentMethod = (method: string): string => {
  const map: Record<string, string> = {
    'credit_card_one_time': '信用卡一次付清',
    'atm_virtual': '虛擬帳號',
    'taiwan_pay': '台灣Pay',
    'cash': '現金'
  }
  return map[method] || method
}

// Get order progress steps
const getOrderProgressSteps = (order: Order) => {
  const formatSimpleDate = (dateString: string | null): string | null => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleString('zh-TW', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const payment = paymentsMap.value[order.id]
  const shipment = shipmentsMap.value[order.id]
  const isPaid = payment?.status === 'paid'
  const paidTime = isPaid ? payment.paidAt : order.paidAt
  
  // Check if order is completed based on shipment delivered date or order completed date
  const isCompleted = !!order.completedAt || !!shipment?.deliveredDate
  const completedTime = shipment?.deliveredDate || order.completedAt
  
  const steps = [
    { key: 'created', label: '收到訂單', completed: true, time: formatSimpleDate(order.createdAt) },
    { key: 'paid', label: '已付款', completed: isPaid, time: formatSimpleDate(paidTime) },
    { key: 'shipped', label: '已出貨', completed: !!order.shippedAt, time: formatSimpleDate(order.shippedAt) },
    { key: 'completed', label: '已完成', completed: isCompleted, time: formatSimpleDate(completedTime) }
  ]

  return steps
}

// Format date
const formatDate = (dateString: string | null): string => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 處理分頁變化
const handlePageChange = (page: number) => {
  error.value = null
  handleCurrentChange(page).catch((err: any) => {
    error.value = err.message || '載入訂單失敗'
  })
}

// Toggle order expansion
const toggleOrder = async (orderId: number) => {
  if (expandedOrderId.value === orderId) {
    expandedOrderId.value = null
    return
  }
  expandedOrderId.value = orderId

  // Load order items if not cached
  if (!orderItemsMap.value[orderId]) {
    orderItemsLoading.value[orderId] = true
    try {
      const result = await getOrderItems(orderId)
      orderItemsMap.value[orderId] = result.list
    } catch (err) {
      console.error('Failed to load order items:', err)
    } finally {
      orderItemsLoading.value[orderId] = false
    }
  }

  // Load payment info
  if (!(orderId in paymentsMap.value)) {
    paymentLoading.value[orderId] = true
    try {
      const payment = await getOrderPayment(orderId)
      paymentsMap.value[orderId] = payment
    } catch (err) {
      paymentsMap.value[orderId] = null
      console.error('Failed to load payment:', err)
    } finally {
      paymentLoading.value[orderId] = false
    }
  }

  // Load shipment info
  if (!(orderId in shipmentsMap.value)) {
    shipmentLoading.value[orderId] = true
    try {
      const shipment = await getOrderShipment(orderId)
      shipmentsMap.value[orderId] = shipment
    } catch (err) {
      shipmentsMap.value[orderId] = null
      console.error('Failed to load shipment:', err)
    } finally {
      shipmentLoading.value[orderId] = false
    }
  }
}

// Navigation
const goShopping = () => {
  router.push('/')
}

const goToCheckout = (orderId: number) => {
  router.push(`/checkout?orderId=${orderId}`)
}

// Payment retry dialog functions
const openPaymentRetryDialog = (orderId: number) => {
  selectedOrderId.value = orderId
  showPaymentRetryDialog.value = true
}

const handlePaymentRetry = (params: { orderId: number; email: string }) => {
  // Payment is handled by the dialog component
  // Just log for debugging
  console.log('Payment retry initiated:', params)
}

const handlePaymentRetryCancel = () => {
  selectedOrderId.value = 0
  showPaymentRetryDialog.value = false
}

// Delivery confirmation functions
const confirmDelivery = async (orderId: number) => {
  try {
    await ElMessageBox.confirm(
      '您確定已收到此訂單的商品嗎？',
      '確認收貨',
      {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    confirmingDelivery.value[orderId] = true
    
    await updateOrderShipment({
      orderId,
      deliveredDate: new Date().toISOString()
    })
    
    // Update local order status
    const orderIndex = orders.value.findIndex(order => order.id === orderId)
    if (orderIndex !== -1) {
      orders.value[orderIndex].status = 'completed'
      orders.value[orderIndex].completedAt = new Date().toISOString()
    }
    
    ElMessage.success('訂單已標記為已完成')
    
  } catch (error: any) {
    ElMessage.warning(error.message || '取消確認收貨')
  } finally {
    confirmingDelivery.value[orderId] = false
  }
}

// Initialize
onMounted(() => {
  loadOrders().catch((err: any) => {
    error.value = err.message || '載入訂單失敗'
  })
})

// 應用日期篩選
const applyDateFilter = () => {
  if (!dateRange.value || !isDateRangeValid.value) return
  const [startDate, endDate] = dateRange.value
  filters.value = { startDate, endDate }
  error.value = null
  handleSearch().catch((err: any) => {
    error.value = err.message || '搜尋失敗'
  })
}

// 清除日期篩選
const clearDateFilter = () => {
  dateRange.value = null
  filters.value = {}
  error.value = null
  handleSearch().catch((err: any) => {
    error.value = err.message || '載入訂單失敗'
  })
}
</script>

<style scoped>
.my-orders-page {
  min-height: 100vh;
  background-color: var(--el-bg-color-page);
  padding: 20px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.page-header {
  max-width: 900px;
  margin: 0 auto 24px;
  flex-shrink: 0;
}

.page-header h2 {
  margin: 0 0 16px 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.filter-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.date-filter {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-label {
  font-size: 14px;
  color: var(--el-text-color-regular);
  white-space: nowrap;
}

.loading-container,
.error-container,
.empty-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
}

.orders-container {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-card {
  background: var(--el-bg-color);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

.order-card.expanded {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.order-header {
  padding: 16px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.order-header:hover {
  background-color: var(--el-fill-color-light);
}

.order-main-info {
  flex: 1;
  min-width: 0;
}

.order-info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.order-info-row:last-child {
  margin-bottom: 0;
}

.order-price-breakdown {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 8px;
  padding: 8px 0;
  border-top: 1px dashed var(--el-border-color-lighter);
}

.price-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.price-row .label {
  width: 60px;
}

.price-row.discount .value {
  color: var(--el-color-danger);
}

.price-row .value {
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.order-total-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.order-total-row .price {
  font-weight: 600;
  color: var(--el-color-danger);
  font-size: 18px;
}

.order-number .value {
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.order-date .value {
  color: var(--el-text-color-regular);
  font-size: 14px;
}

.label {
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.expand-icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  transition: all 0.3s ease;
}

.order-header:hover .expand-icon {
  background: var(--el-fill-color);
  color: var(--el-color-primary);
}

.order-details {
  padding: 0 20px 20px;
}

.section {
  margin-top: 16px;
}

.section h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.section-loading {
  padding: 12px 0;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--el-fill-color-light);
  border-radius: 6px;
}

.item-image {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-weight: 500;
  color: var(--el-text-color-primary);
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-meta {
  display: flex;
  gap: 12px;
  font-size: 14px;
}

.item-price {
  color: var(--el-color-danger);
  font-weight: 500;
}

.item-quantity {
  color: var(--el-text-color-secondary);
}

.shipment-info {
  background: var(--el-fill-color-light);
  padding: 16px;
  border-radius: 6px;
}

.shipment-row {
  display: flex;
  margin-bottom: 8px;
}

.shipment-row:last-child {
  margin-bottom: 0;
}

.shipment-row .label {
  width: 80px;
  flex-shrink: 0;
}

.shipment-row .value {
  color: var(--el-text-color-primary);
  font-weight: 500;
}

.shipment-divider {
  margin: 12px 0;
}

.shipment-empty {
  padding: 16px;
  text-align: center;
  background: var(--el-fill-color-light);
  border-radius: 6px;
}

.tracking-reminder {
  margin-top: 16px;
}

.tracking-alert {
  border: 1px solid var(--el-color-primary-light-5);
  background: var(--el-color-primary-light-9);
}

.tracking-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tracking-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tracking-number {
  font-weight: 600;
  color: var(--el-color-primary);
  font-size: 16px;
  letter-spacing: 1px;
  background: var(--el-color-primary-light-9);
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid var(--el-color-primary-light-5);
  display: inline-block;
  margin-top: 4px;
}

.tracking-action {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tracking-link {
  font-weight: 600;
  text-decoration: underline;
}

.delivery-confirmation {
  margin-top: 16px;
  text-align: right;
}

.confirm-delivery-btn {
  min-width: 100px;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .tracking-content {
    font-size: 14px;
  }
  
  .tracking-number {
    font-size: 14px;
    padding: 3px 6px;
  }
  
  .tracking-link {
    font-size: 13px;
  }
  
  .delivery-confirmation {
    text-align: center;
  }
  
  .confirm-delivery-btn {
    width: 100%;
    max-width: 200px;
  }
}

.payment-info {
  background: var(--el-fill-color-light);
  padding: 16px;
  border-radius: 6px;
}

.payment-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.payment-row:last-child {
  margin-bottom: 0;
}

.payment-row .label {
  width: 80px;
  flex-shrink: 0;
}

.payment-row .value {
  color: var(--el-text-color-primary);
  font-weight: 500;
}

.payment-row .price {
  color: var(--el-color-danger);
}

.payment-empty {
  padding: 16px;
  text-align: center;
  background: var(--el-fill-color-light);
  border-radius: 6px;
}

.payment-actions {
  margin-top: 12px;
  text-align: right;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 0;
  margin-top: 8px;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .my-orders-page {
    padding: 12px 12px 80px 12px;
  }

  .page-header h2 {
    font-size: 20px;
  }

  .date-filter {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
  }

  .filter-label {
    margin-bottom: 4px;
  }

  .order-header {
    padding: 12px 16px;
  }

  .order-info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .expand-icon {
    right: 16px;
  }

  .order-details {
    padding: 0 16px 16px;
  }

  .item-row {
    flex-wrap: wrap;
  }

  .item-status {
    width: 100%;
    text-align: right;
    margin-top: 8px;
  }

  .pagination-container {
    padding: 16px 0 60px 0;
  }
}

/* Order Progress Timeline */
.progress-timeline {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px 12px;
  background: var(--el-fill-color-light);
  border-radius: 8px;
  overflow-x: auto;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  min-width: 70px;
  position: relative;
}

.step-top {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  height: 14px;
}

.step-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--el-color-primary);
  border: 2px solid var(--el-color-primary);
  flex-shrink: 0;
  z-index: 1;
}

.progress-step.pending .step-dot {
  background: var(--el-bg-color);
  border-color: var(--el-border-color);
}

.step-line {
  position: absolute;
  left: 50%;
  right: -50%;
  height: 2px;
  background: var(--el-border-color);
  top: 50%;
  transform: translateY(-50%);
}

.step-line.completed {
  background: var(--el-color-primary);
}

.step-info {
  text-align: center;
  margin-top: 12px;
}

.step-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  white-space: nowrap;
}

.progress-step.pending .step-label {
  color: var(--el-text-color-secondary);
}

.step-time {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 4px;
  white-space: nowrap;
}

.step-time.pending {
  color: var(--el-text-color-placeholder);
}

/* Mobile responsive for timeline */
@media (max-width: 768px) {
  .progress-timeline {
    padding: 12px 4px;
  }

  .step-label {
    font-size: 12px;
  }

  .step-time {
    font-size: 11px;
  }
}
</style>
