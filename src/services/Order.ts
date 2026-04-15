import type { Order, OrderItem } from "@/model";
import type { Pagination } from "@/model/Pagination";
import { request } from "./Request";


/**
 * 新增訂單
 * @param params 訂單參數
 * @param params.paymentMethod 付款方式
 * @param params.shippingMethod 配送方式
 * @param params.couponCode 優惠券代碼
 * @param params.recipientName 收件人姓名
 * @param params.recipientPhone 收件人電話
 * @param params.shippingAddress 配送地址
 * @param params.remarks 備註
 * @returns Promise<Order> - 訂單資訊
 */
export async function addOrder(params: {
  paymentMethod: string;
  shippingMethod: string;
  couponCode?: string;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  remarks?: string
}) : Promise<Order> {
  return await request<Order>('/api/orders', 'POST', params)
}

/**
 * 獲取我的訂單列表
 * @param params - 查詢參數
 * @param params.status - 訂單狀態過濾（可選）
 * @param params.search - 搜尋關鍵字（可選）
 * @param params.startDate - 開始日期（可選）
 * @param params.endDate - 結束日期（可選）
 * @param params.cursor - 分頁游標（首次請求傳 null）
 * @param params.size - 每頁數量
 * @returns Promise<Pagination<Order>> - 分頁訂單列表
 */
export async function getMyOrders(params:{
  status?: string,
  search?: string;
  startDate?: string;
  endDate?: string;
  cursor?: string,
  size?: number
}): Promise<Pagination<Order>> {
  return await request<Pagination<Order>>('/api/my-orders', 'GET', params)
}

/**
 * 獲取訂單項目
 * 
 * @param orderId - 訂單 ID，必填
 * @returns Promise<Pagination<OrderItem>> - 訂單項目列表
 */
export async function getOrderItems(orderId: number): Promise<Pagination<OrderItem>> {
  return await request<Pagination<OrderItem>>('/api/orders/items', 'GET', { orderId })
}