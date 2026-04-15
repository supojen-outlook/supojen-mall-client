import type { Category, CategoryStatus, Pagination } from "@/model"
import { request } from "./Request"

/**
 * 查詢系統中的產品類別列表
 * @param params 查詢參數
 * @param params.parentId 父類別 ID（可選），用於查詢指定父類別下的子類別
 * @param params.level 類別層級（可選），用於查詢指定層級的類別
 * @param params.status 類別狀態（可選），用於篩選啟用或停用的類別
 * @param params.search 搜尋關鍵字（可選），會在 Name、Slug 中搜尋
 * @param params.cursor 分頁游標（可選），用於分頁
 * @param params.isLeaf 是否為葉子節點（可選）
 * @param params.size 每頁資料筆數（可選），預設 1000
 * @returns 返回產品類別列表
 */
export async function getCategories(params?: {
  parentId?: number;
  level?: number;
  status?: CategoryStatus;
  search?: string;
  cursor?: string;
  isLeaf?: boolean;
  size?: number;
}): Promise<Pagination<Category>> {
  return await request<Pagination<Category>>('/api/categories', 'GET', params)
}

/**
 * 查詢產品類別總數量
 * @returns 返回符合條件的產品類別總數量
 */
export async function getCategoryCount(): Promise<number> {
  return await request<number>('/api/categories/count', 'GET')
}

/**
 * 獲取類別路徑
 * @param id 類別 ID
 * @returns 返回類別路徑
 */
export async function getCategoryPath(id: number): Promise<number[]> {
  return await request<number[]>(`/api/categories/${id}/path`, 'get');
}
