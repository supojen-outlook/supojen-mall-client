
/**
 * 付款方式
 * 
 * @enum {string}
 * @property credit_card_one_time - 信用卡一次付清
 * @property atm_virtual - 虛擬帳號
 * @property taiwan_pay - 台灣Pay
 * @property cash - 現金
 */
export type PaymentMethod = 'credit_card_one_time' | 'atm_virtual' | 'taiwan_pay' | 'cash' | 'cvs' | 'other';

/**
 * 付款狀態
 * 
 * @enum {string}
 * @property pending - 等待付款
 * @property paid - 已付款
 * @property failed - 付款失敗
 * @property refunded - 已退款
 */
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

/**
 * Payment API 回應模型
 *
 * @property id - 付款記錄唯一識別碼
 * @property orderId - 訂單 ID
 * @property method - 付款方式
 * @property transactionId - 金流平台交易編號
 * @property amount - 付款金額
 * @property status - 付款狀態
 * @property createdAt - 記錄建立時間
 * @property paidAt - 付款時間
 * @property refundedAt - 退款時間
 * @property snapshot - 金流平台回傳的完整交易資訊（JSONB）
 * @property bankCode - 銀行代碼
 * @property codeNo - 銀行帳號或超商代碼
 * @property expiredAt - 付款期限
 */
export interface Payment {
  id: number;
  orderId: number;
  method: PaymentMethod;
  transactionId: string | null;
  amount: number;
  status: PaymentStatus;
  createdAt: string;
  paidAt: string | null;
  refundedAt: string | null;
  snapshot: Record<string, unknown> | null;
  bankCode: string | null;
  codeNo: string | null;
  expiredAt: string | null;
}
