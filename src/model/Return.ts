/**
 * 退貨狀態
 * 
 * @enum {string}
 * @property requested - 申請
 * @property approved - 核准
 * @property rejected - 拒絕
 * @property received - 收到貨
 * @property refunded - 已退款
 */
export type ReturnStatus = 'requested' | 'approved' | 'rejected' | 'received' | 'refunded';

/**
 * 退款方式
 * 
 * @enum {string}
 * @property original - 原路退回
 * @property balance - 購物金
 * @property bank_transfer - 銀行轉帳
 */
export type RefundMethod = 'original' | 'balance' | 'bank_transfer';

/**
 * Return API 回應模型
 *
 * @property id - 退貨單唯一識別碼
 * @property returnNumber - 退貨單編號
 * @property orderItemId - 訂單項目 ID
 * @property quantity - 退貨數量
 * @property reason - 退貨原因
 * @property status - 退貨狀態
 * @property refundAmount - 退款金額
 * @property refundMethod - 退款方式
 * @property refundedAt - 退款時間
 * @property requestedAt - 申請時間
 * @property approvedAt - 核准時間
 * @property receivedAt - 收到退貨時間
 * @property createdAt - 記錄建立時間
 * @property staffNotes - 客服/倉管備註
 * @property customerNotes - 客戶備註
 */
export interface Return {
  id: number;
  returnNumber: string;
  orderItemId: number;
  quantity: number;
  reason: string;
  status: ReturnStatus;
  refundAmount: number | null;
  refundMethod: RefundMethod;
  refundedAt: string | null;
  requestedAt: string;
  approvedAt: string | null;
  receivedAt: string | null;
  createdAt: string;
  staffNotes: string;
  customerNotes: string;
}
