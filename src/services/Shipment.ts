import type { Shipment } from '@/model'
import { request } from './Request'

/**
 * 獲取訂單項目物流信息
 * 
 * @param orderId - 訂單 ID，必填
 * @returns Promise<Shipment> - 訂單相關的物流
 */
export async function getOrderShipment(orderId: number): Promise<Shipment> {
  return await request<Shipment>('/api/orders/shipment', 'GET', { orderId })
}