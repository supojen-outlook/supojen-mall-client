import type { Pagination } from '@/model'
import type { ProductBase, Product } from '@/model/Product'
import { request } from './Request'

/**
 * 獲取產品列表
 * 
 * @param params - 查詢參數
 * @param params.size - 每頁大小，預設 20
 * @param params.cursor - 分頁遊標，用於獲取下一頁
 * @param params.search - 搜索關鍵字，可搜索產品名稱、SPU 編碼
 * @param params.categoryId - 類別 ID，篩選指定類別的產品
 * @param params.brandId - 品牌 ID，篩選指定品牌的產品
 * @param params.status - 產品狀態：active上架、inactive下架、draft草稿、pending審核中
 * @param params.sortDirection - 排序方向：asc升序、desc降序
 * @param params.sortBy - 排序字段：id、name、price、createdAt、sortOrder
 * @returns Promise<Pagination<ProductBase>> - 分頁的產品列表
 */
export async function getProducts(params?: {
  size?: number;
  cursor?: string;
  search?: string;
  categoryId?: number;
  brandId?: number;
  status?: 'active' | 'inactive' | 'draft' | 'pending';
  sortDirection?: 'asc' | 'desc';
  sortBy?: 'id' | 'name' | 'price' | 'createdAt' | 'sortOrder';
}): Promise<Pagination<ProductBase>> {
  // 合併參數並強制設定 status 為 'active'
  const requestParams = { ...params, status: 'active' };
  
  return await request<Pagination<ProductBase>>('/api/products', 'GET', requestParams)
}

/**
 * 獲取產品詳情
 * 
 * @param id - 產品 ID
 * @returns Promise<Product> - 完整的產品信息，包含詳細描述、圖片、規格等
 */
export async function getProduct(id: number): Promise<Product> {
  return await request<Product>(`/api/products/${id}`, 'GET')
}
