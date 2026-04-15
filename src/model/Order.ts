export type OrderStatus = 'created' | 'paid' | 'shipped' | 'completed' | 'closed';

/**
 * Order API 回應模型
 *
 * @property id - 訂單唯一識別碼
 * @property orderNumber - 訂單編號，用於查詢和物流
 * @property userId - 顧客 ID
 * @property status - 訂單狀態
 * @property totalAmount - 訂單總金額
 * @property discountAmount - 折扣金額
 * @property taxAmount - 稅金金額
 * @property shippingAmount - 運費金額
 * @property createdAt - 訂單建立時間
 * @property paidAt - 付款時間
 * @property shippedAt - 出貨時間
 * @property completedAt - 完成時間
 * @property snapshot - 訂單快照，記錄當時的商品資訊、價格等
 */
export interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  status: OrderStatus;
  totalAmount: number;
  discountAmount: number;
  taxAmount: number;
  shippingAmount: number;
  createdAt: string;
  paidAt: string | null;
  shippedAt: string | null;
  completedAt: string | null;
  snapshot: Record<string, unknown> | null;
}