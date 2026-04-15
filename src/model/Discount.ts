import type { CartItem } from './CartItem';

/**
 * Discount API 回應模型
 * 
 * @property promotionId - 促銷活動 ID，用於識別折扣來源於哪個促銷活動
 * @property promotionName - 促銷活動名稱，前端展示促銷活動名稱
 * @property ruleId - 促銷規則 ID，識別折扣來源於哪個具體規則
 * @property ruleType - 促銷規則類型：'full_reduction' | 'discount' | 'gift' | 'free_shipping'
 * @property tabName - 規則標籤名稱，前端展示規則名稱
 * @property threshold - 門檻金額，滿額折扣的門檻
 * @property discountAmount - 折扣金額，用於計算訂單最終金額
 * @property isFreeShipping - 是否免運，判斷訂單是否享有免運優惠
 * @property giftItemId - 贈品商品 ID，識別贈品商品
 * @property applicableItems - 適用的購物車項目，識別哪些商品享有此折扣
 */
export interface Discount {
  promotionId: number;
  promotionName: string;
  ruleId: number;
  ruleType: 'full_reduction' | 'discount' | 'gift' | 'free_shipping';
  tabName: string;
  threshold: number;
  discountAmount: number;
  isFreeShipping: boolean;
  giftItemId?: number;
  applicableItems: CartItem[];
}
