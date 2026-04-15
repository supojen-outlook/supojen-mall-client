import { request } from "./Request";


/**
 * 查詢運費
 * @returns Promise<number[]> - 運費
 */
export async function getShippingFee(): Promise<number[]> {
  return await request<number[]>('/api/shipping-rules/fee', 'GET')
}
