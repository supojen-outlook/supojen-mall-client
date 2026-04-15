import { request } from './Request'
import type { Pagination, Sku } from '@/model'

/**
 * 獲取 SKU 分頁列表
 * 
 * @param params - 查詢參數
 * @param params.productId - 商品 ID，必填，必須是資料庫中已存在的商品 ID
 * @param params.ids - SKU ID 陣列，可選，篩選特定 SKU
 * @returns Promise<Pagination<Sku>> - 分頁 SKU 列表
 */
export async function getSkus(params?: {
  productId?: number;
  ids?: number[];
}): Promise<Pagination<Sku>> {
  return await request<Pagination<Sku>>(`/api/products/skus`, 'GET', params)
}