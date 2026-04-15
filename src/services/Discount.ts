import type { Coupon, Discount } from "@/model";
import { request } from "./Request";


/**
 * 查詢折扣列表
 * @returns Promise<Discount[]> - 折扣列表
 */
export async function getAvailableDiscounts(): Promise<Discount[]> {
  return await request<Discount[]>('/api/available-discounts', 'GET')
}

/**
 * 查詢可用優惠券列表
 * @returns Promise<Coupon[]> - 優惠券列表
 */
export async function getAvaliableCoupons(): Promise<Coupon[]> {
  return await request<Coupon[]>('/api/available-coupons', 'GET')
}