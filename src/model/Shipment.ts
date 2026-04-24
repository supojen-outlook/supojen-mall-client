
/**
 * 物流方式
 * 
 * @enum {string}
 * @property post - 郵政
 * @property seven - 7-11
 * @property family - 全家
 */
export type ShipmentMethod = 'post' | 'seven' | 'family';

/**
 * Shipment API 回應模型
 *
 * @property id - 物流單唯一識別碼
 * @property orderItemId - 訂單項目 ID
 * @property method - 物流方式
 * @property trackingNumber - 物流追蹤編號
 * @property shippingAddress - 寄送地址
 * @property recipientName - 收件人姓名
 * @property recipientPhone - 收件人電話
 * @property shipDate - 出貨日期
 * @property deliveredDate - 送達日期
 * @property createdAt - 記錄建立時間
 */
export interface Shipment {
  id: number;
  orderItemId: number;
  method: ShipmentMethod | null;
  trackingNumber: string | null;
  shippingAddress: string | null;
  recipientName: string;
  recipientPhone: string;
  shipDate: string | null;
  deliveredDate: string | null;
  createdAt: string;
}
