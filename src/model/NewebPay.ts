

/**
 * NewebPay 訂單資訊
 * 
 * @property merchantID - 商店代號
 * @property tradeInfo - 交易資訊
 * @property tradeSha - 交易 SHA
 */
export interface NewebPay {
  merchantID: string;
  tradeInfo: string;
  tradeSha: string;   
}
