export type OrderItemStatus = 'pending' | 'shipped' | 'refunded' | 'cancelled';

/**
 * OrderItem API 回應模型
 *
 * @property id - 訂單項目唯一識別碼
 * @property orderId - 所屬訂單 ID
 * @property productId - 商品 ID
 * @property skuId - SKU ID
 * @property productName - 下單時的商品名稱（快照）
 * @property productImageUrl - 下單時的商品圖片（快照）
 * @property unitPrice - 下單時的單價（快照）
 * @property quantity - 購買數量
 * @property returnedQuantity - 已退貨數量
 * @property status - 項目狀態
 * @property createdAt - 項目建立時間
 */
export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  skuId: number;
  productName: string;
  productImageUrl: string;
  unitPrice: number;
  quantity: number;
  returnedQuantity: number;
  status: OrderItemStatus;
  createdAt: string;
}
