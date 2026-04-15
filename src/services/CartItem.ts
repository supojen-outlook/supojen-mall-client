import type { Pagination } from '@/model'
import type { CartItem } from '@/model/CartItem'
import { request } from './Request'

/**
 * 查詢購物車項目列表
 * @param params - 查詢參數
 * @param params.type - 購物車類型：shopping (預設)、wishlist
 * @param params.cursor - 分頁遊標
 * @param params.size - 每頁大小，預設 20
 * @returns Promise<Pagination<CartItem>> - 分頁的購物車項目列表
 */
export async function getCartItems(params?: {
  type?: 'shopping' | 'wishlist';
  cursor?: string;
  size?: number;
}): Promise<Pagination<CartItem>> {
  // 過濾掉空值、null 和 undefined 的參數
  const filteredParams = params ? Object.fromEntries(
    Object.entries(params).filter(([_, value]) => 
      value !== undefined && value !== null && value !== ''
    )
  ) : {};
  
  return await request<Pagination<CartItem>>('/api/cart-items', 'GET', filteredParams)
}

/**
 * 新增購物車項目
 * @param data - 新增數據
 * @param data.skuId - 商品 SKU ID
 * @param data.quantity - 數量
 * @param data.type - 加入類型，預設 shopping
 * @returns Promise<CartItem> - 新增成功的購物車項目
 */
export async function addCartItem(data: {
  skuId: number;
  quantity: number;
  type?: 'shopping' | 'wishlist';
}): Promise<CartItem> {
  return await request<CartItem>('/api/cart-items', 'POST', data)
}

/**
 * 更新購物車項目
 * @param data - 更新數據
 * @param data.id - 購物車項目 ID
 * @param data.quantity - 新數量
 * @param data.type - 類型切換 (例如從 shopping 移至 wishlist)
 * @returns Promise<void>
 */
export async function updateCartItem(data: {
  id: number;
  quantity?: number;
  type?: 'shopping' | 'wishlist';
}): Promise<void> {
  return await request<void>('/api/cart-items', 'PUT', data)
}

/**
 * 刪除購物車項目
 * @param data - 刪除數據
 * @param data.id - 購物車項目 ID
 * @param data.type - 類型，預設 shopping
 * @returns Promise<void>
 */
export async function deleteCartItem(data: {
  id: number,
  type: 'shopping' | 'wishlist';
}): Promise<void> {
  // 根據後端 [AsParameters] CartItemDeleteCommand，通常這類 Minimal API 會將參數放在 URL query 或 Body
  // 這裡對齊你 deleteProduct 的實作方式，將 id 放入 data 送出
  return await request<void>('/api/cart-items', 'DELETE', data)
}