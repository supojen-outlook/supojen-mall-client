import type { NewebPay } from "@/model";
import { request } from "./Request";

/**
 * 建立新訂單
 * @param params 訂單參數
 * @param params.orderId 訂單 ID
 * @param params.email 用戶邮箱
 * @returns Promise<NewebPay> - 新訂單資訊
 */
export async function requestNewebPay(params:{
  orderId: number;
  email: string;
}) : Promise<NewebPay>{
  return await request<NewebPay>('/api/payment/create', 'POST', params)
}