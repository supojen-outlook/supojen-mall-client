import type { Specification } from "./Specification";

/**
 * CartItem API 回應模型
 * 
 * @property id - 購物車項目唯一識別碼
 * @property userId - 使用者 ID，外鍵約束：fk_cart_items_user
 * @property cartType - 購物車類型：'shopping' | 'wishlist'
 * @property productId - 商品 ID，外鍵約束：fk_cart_items_product
 * @property skuId - SKU ID，外鍵約束：fk_cart_items_sku
 * @property productName - 商品名稱（快照），避免商品資訊變更影響歷史購物車
 * @property skuAttributes - SKU 屬性（快照），保存選擇的 SKU 規格
 * @property unitPrice - 單價（快照），避免價格變更影響歷史購物車
 * @property currency - 貨幣代碼，預設值：'NTD'
 * @property quantity - 數量，預設值：1
 * @property productImage - 商品圖片（快照），優先使用 SKU 圖片
 * @property createdAt - 建立時間，預設值：現在時間
 * @property updatedAt - 更新時間，預設值：現在時間
 */
export interface CartItem {
  id: number;
  userId: number;
  cartType: 'shopping' | 'wishlist';
  productId: number;
  skuId?: number;
  productName: string;
  skuAttributes: Specification[];
  unitPrice: number;
  currency: string;
  quantity: number;
  productImage: string;
  createdAt: Date;
  updatedAt: Date;
}
