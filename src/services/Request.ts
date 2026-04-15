import axios, { type Method, type AxiosRequestConfig } from "axios";
import { useAccountStore } from "@/stores";
import { getValidToken, clearToken } from './antiforgery';


/**
 * API 錯誤類
 */
class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }

  static fromAxiosError(error: any, defaultMessage: string): ApiError {
    const message = error.response?.data?.title || defaultMessage;
    return new ApiError(message);
  }
}

/**
 * API 全域配置
 * 
 * @property BASE_URL - API 服務器基礎 URL，所有 API 請求都會基於此地址
 */
const API_CONFIG = {
  BASE_URL: 'https://localhost:7175'
}

/**
 * 建立 Axios 實例
 * 
 * 所有的 API 請求都會透過這個實例發送，統一管理配置和攔截器
 * 
 * @property baseURL - API 基礎 URL
 * @property timeout - 請求超時時間（10秒）
 * @property withCredentials - 攜帶認證 Cookie，確保跨域請求能正確傳遞憑證
 * @property headers - 預設請求頭，設置為 JSON 格式
 */
const worker = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
  withCredentials: true, // 確保攜帶 Cookie (包含 Antiforgery Cookie)
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * ============================================
 * ⭐ 請求攔截器 (Request Interceptor)
 * ============================================
 * 
 * 在每個請求發出之前自動執行，主要功能：
 * 1. 自動管理並附加防偽令牌
 * 2. 確保只有會改變伺服器狀態的請求才添加令牌
 * 
 * @param config - Axios 請求配置對象
 * @returns Promise - 返回修改後的配置，繼續請求流程
 */
worker.interceptors.request.use(async config => {
  // 僅針對會改變伺服器狀態的請求方法添加令牌
  // 這些方法通常需要 CSRF 保護
  const stateChangingMethods = ['post', 'put', 'delete', 'patch'];
  const currentMethod = config.method?.toLowerCase() || '';

  if (stateChangingMethods.includes(currentMethod)) {
    // 獲取有效的令牌（如果過期會在此處自動非同步刷新）
    const token = await getValidToken();
    if (token) {
      // 將令牌添加到請求頭，用於 CSRF 保護
      config.headers['X-CSRF-TOKEN'] = token;
    } else {
      // 如果無法獲取令牌，記錄警告但不阻止請求
      console.warn('⚠️ 無法獲取有效的防偽令牌，請求可能被伺服器拒絕');
    }
  }
  
  return config;
}, error => {
  // 攔截器錯誤處理，通常很少發生
  return Promise.reject(error);
});

/**
 * ============================================
 * ⭐ 響應攔截器 (Response Interceptor)
 * ============================================
 * 
 * 統一處理所有 API 響應，包括：
 * 1. 401 身分驗證失敗 - 自動登出並重導向登入頁面
 * 2. 400 防偽驗證失敗 - 清除本地令牌緩存
 * 3. 其他錯誤 - 統一錯誤處理流程
 * 
 * @param response - 成功的響應對象
 * @param error - 失敗的錯誤對象
 * @returns Promise - 成功時返回響應，失敗時返回拒絕的 Promise
 */
worker.interceptors.response.use(
  response => response,
  error => {
    // 1. 統一處理 401 身分驗證失敗
    if (error.response?.status === 401) {
      // 清除用戶狀態並重導向到登入頁面
      useAccountStore().logout();
      window.location.href = '/login';
    }
    
    // 2. ⭐ 統一處理防偽驗證失敗 (通常為 400 且含有 Antiforgery 關鍵字)
    if (error.response?.status === 400 && 
        error.response?.data?.detail?.toLowerCase().includes('antiforgery')) {
      console.log('🛑 防偽驗證失敗，正在清除本地令牌緩存');
      // 清除可能已過期的本地令牌
      clearToken();
    }
    
    // 3. 其他錯誤交由調用方處理
    return Promise.reject(error);
  }
);

/**
 * 處理陣列參數，將陣列轉換為逗號分隔的字符串
 * 
 * 這個函數解決了 Axios 默認將陣列參數轉換為 `ids[]=1&ids[]=2` 格式的問題
 * 將其轉換為後端期望的 `ids=1,2` 格式
 * 
 * @param params - 原始參數對象
 * @returns 處理後的參數對象，陣列參數已轉換為字符串
 */
function processArrayParams(params: any): any {
  if (!params) return params;
  
  const processed = { ...params };
  
  // 遍歷所有參數，檢查是否為陣列
  Object.keys(processed).forEach(key => {
    if (Array.isArray(processed[key])) {
      // 將陣列轉換為逗號分隔的字符串
      // 例如：[1, 2, 3] → "1,2,3"
      processed[key] = processed[key].join(',');
    }
  });
  
  return processed;
}

/**
 * 封裝的基礎請求函數
 * 
 * 提供統一的 API 請求介面，自動處理：
 * - 參數過濾（移除空值、null、undefined）
 * - 陣列參數轉換（將陣列轉換為逗號分隔的字符串）
 * - 請求方法區分（GET/DELETE 使用 params，POST/PUT 使用 data）
 * - 錯誤處理和拋出
 * 
 * @template T - 響應數據類型
 * @param path - API 路徑，如 '/api/products'
 * @param method - HTTP 請求方法：GET、POST、PUT、DELETE 等
 * @param params - 請求參數，GET 請求會轉為 query string，POST 請求會轉為 request body
 * @param _errMessage - 錯誤消息（保留用於未來擴展）
 * @returns Promise<T> - 返回指定類型的響應數據
 */
async function request<T = void>(
  path: string, 
  method: Method, 
  params: any = {},
  _errMessage: string = '請求失敗'
): Promise<T> {
  try {
    // 第一步：過濾掉空值、null 和 undefined 的參數
    // 這確保不會將無用的空參數添加到 URL 或請求體中
    const filteredParams = params ? Object.fromEntries(
      Object.entries(params).filter(([_, value]) => 
        value !== undefined && value !== null && value !== ''
      )
    ) : {};

    // 第二步：處理陣列參數
    // 將所有陣列參數轉換為逗號分隔的字符串
    // 例如：{ ids: [1, 2, 3] } → { ids: "1,2,3" }
    const processedParams = processArrayParams(filteredParams);

    // 第三步：構建 Axios 請求配置
    const upperMethod = method.toString().toUpperCase();
    const config: AxiosRequestConfig = {
      method: upperMethod,
      url: path
    };

    // 第四步：根據請求方法區分參數傳遞方式
    if (['GET', 'DELETE'].includes(upperMethod)) {
      // GET 和 DELETE 請求：參數作為 query string 傳遞
      // 處理後的參數會被 Axios 序列化為 URL 查詢參數
      // 例如：{ ids: "1,2,3" } → ?ids=1,2,3
      config.params = processedParams;
    } else {
      // POST、PUT、PATCH 請求：參數作為 request body 傳遞
      // 對於這些請求，我們保持陣列的原始格式
      config.data = params; // 使用原始參數，不進行陣列處理
    }

    // 第五步：發送請求並返回響應
    const response = await worker.request(config);
    return response.data as T;

  } catch (err: any) {
    throw ApiError.fromAxiosError(err, _errMessage);
  }
} 

/**
 * 導出的 API 配置和工具
 */
export {
  request,      // 統一的請求函數
  worker,       // Axios 實例，供特殊場景使用（如文件上傳）
  API_CONFIG    // API 配置，供其他地方引用
};
