# Manian 電商前台客戶端

一個使用 Vue 3 + TypeScript + Vite 開發的現代化電子商務前台應用程式。提供完整的商品瀏覽、購物車管理、訂單結帳與用戶管理功能。

## 技術棧

- **框架**: Vue 3 (Composition API + `<script setup>`)
- **語言**: TypeScript
- **構建工具**: Vite
- **UI 組件庫**: Element Plus
- **狀態管理**: Pinia
- **路由**: Vue Router
- **HTTP 客戶端**: Axios
- **樣式**: SCSS / CSS3
- **圖標**: Element Plus Icons

## 專案結構

```
src/
├── assets/           # 靜態資源（圖片、樣式）
├── base/             # 基礎配置（路由、環境設定）
│   ├── Router.ts     # Vue Router 路由配置
│   └── index.ts
├── components/       # Vue 組件
│   └── index.ts      # 組件統一導出
├── composables/      # 組合式函數
├── model/            # 資料模型（TypeScript Interfaces）
├── services/         # API 服務層
├── stores/           # Pinia 狀態管理
├── types/            # 全域類型定義
├── views/            # 頁面級組件
├── App.vue           # 根組件
├── main.ts           # 入口文件
└── style.css         # 全域樣式
```

## 組件說明

### 導航與布局組件

| 組件 | 路徑 | 功能說明 |
|------|------|----------|
| **TopNavBar** | `components/TopNavBar/` | 頂部導航欄，包含 Logo、主選單、用戶下拉選單。支援響應式設計（桌面/手機版切換），顯示登入狀態與用戶頭像 |
| **Footer** | `components/Footer/` | 頁尾組件 |

### 商品相關組件

| 組件 | 路徑 | 功能說明 |
|------|------|----------|
| **ProductCard** | `components/ProductCard/` | 商品卡片，顯示商品圖片、名稱、標籤與價格。支援響應式網格布局（桌面 6 欄、平板 3 欄、手機 2 欄）|
| **ProductList** | `components/ProductList/` | 商品列表容器，管理多個 ProductCard 的排列與分頁 |
| **ProductImageGallery** | `components/ProductImageGallery/` | 商品圖片輪播/縮略圖展示 |
| **ProductInfo** | `components/ProductInfo/` | 商品詳細資訊展示 |
| **SkuSelector** | `components/SkuSelector/` | SKU（規格）選擇器，讓用戶選擇商品規格與數量 |
| **SpecificationDisplay** | `components/SpecificationDisplay/` | 商品規格參數展示 |
| **CategoryFilter** | `components/CategoryFilter/` | 商品分類篩選器 |
| **SearchBar** | `components/SearchBar/` | 搜尋輸入框組件 |
| **SearchProductList** | `components/SearchProductList/` | 搜尋結果商品列表 |

### 購物車與結帳組件

| 組件 | 路徑 | 功能說明 |
|------|------|----------|
| **CartItemRow** | `components/CartItemRow/` | 購物車單一商品行，顯示商品圖片、名稱、規格、數量調整與價格 |
| **CartItemList** | `components/CartItemList/` | 購物車商品列表容器，管理多個 CartItemRow |
| **CheckoutSummary** | `components/CheckoutSummary/` | 結帳摘要面板，顯示原價總額、折扣明細、最終金額與結帳按鈕 |
| **CartSummarySection** | `components/CartSummarySection/` | 購物車摘要區塊 |
| **DiscountSection** | `components/DiscountSection/` | 優惠券/折扣碼輸入區 |
| **PaymentMethodSection** | `components/PaymentMethodSection/` | 付款方式選擇 |
| **ShippingMethodSection** | `components/ShippingMethodSection/` | 配送方式選擇 |
| **RecipientForm** | `components/RecipientForm/` | 收件人資訊表單 |
| **OrderSummary** | `components/OrderSummary/` | 訂單摘要展示 |

### 其他組件

| 組件 | 路徑 | 功能說明 |
|------|------|----------|
| **AssetUpload** | `components/AssetUpload/` | 資源上傳組件 |
| **HelloWorld** | `components/HelloWorld.vue` | 範例組件 |

## 頁面說明 (Views)

| 頁面 | 路徑 | 功能說明 |
|------|------|----------|
| **HomePage** | `views/HomePage.vue` | 首頁，展示推薦商品與分類 |
| **AboutPage** | `views/AboutPage.vue` | 關於我們頁面 |
| **ProductPage** | `views/ProductPage.vue` | 商品詳情頁，整合圖片輪播、規格選擇、加入購物車功能 |
| **CartPage** | `views/CartPage.vue` | 購物車頁面，管理購物車商品與結帳流程 |
| **ConfirmOrderPage** | `views/ConfirmOrderPage.vue` | 確認訂單頁，填寫收件資訊、選擇配送與付款方式 |
| **MyOrdersPage** | `views/MyOrdersPage.vue` | 我的訂單頁面，查看歷史訂單與訂單詳情 |
| **SearchPage** | `views/SearchPage.vue` | 商品搜尋結果頁 |
| **LoginPage** | `views/LoginPage.vue` | 用戶登入頁（無導航欄）|
| **SignupPage** | `views/SignupPage.vue` | 用戶註冊頁（無導航欄）|
| **ResetPasswordPage** | `views/ResetPasswordPage.vue` | 密碼重設頁（無導航欄）|
| **ProfilePage** | `views/ProfilePage.vue` | 個人資料管理頁 |

## 資料模型 (Model)

| 模型 | 說明 |
|------|------|
| `Product` | 商品基礎資訊（ID、名稱、價格、圖片、標籤）|
| `Category` | 商品分類 |
| `Sku` | 商品 SKU（規格組合）|
| `Specification` | 商品規格參數 |
| `CartItem` | 購物車項目 |
| `Order` / `OrderItem` | 訂單與訂單項目 |
| `Payment` | 付款資訊 |
| `Shipment` | 配送資訊 |
| `Discount` / `Coupon` | 折扣規則與優惠券 |
| `Profile` | 用戶個人資料 |
| `Return` | 退貨申請 |
| `Pagination` | 分頁參數 |

## 狀態管理 (Stores)

- **AccountStore**: 管理用戶登入狀態與個人資料
- **DiscountStore**: 管理購物車折扣與優惠券

## 開發指令

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 建置生產版本
npm run build

# 預覽生產版本
npm run preview
```

## 部署方式

### 1. 本地開發部署

```bash
# 1. 安裝依賴
npm install

# 2. 啟動開發伺服器（預設 http://localhost:5173）
npm run dev
```

### 2. 生產環境部署（Docker + GitHub Actions）

#### 步驟 1：推送 Git Tag 觸發建置

```bash
# 1. 確保所有變更已提交
git add .
git commit -m "準備部署 v1.0.0"

# 2. 建立並推送 tag，觸發 GitHub Actions
VERSION="v1.0.0"
git tag $VERSION
git push origin $VERSION
```

GitHub Actions 會自動建置 Docker 映像並推送到 GitHub Container Registry (ghcr.io)。

#### 步驟 2：伺服器部署

```bash
# 1. 登入 GitHub Container Registry
docker login ghcr.io -u <你的 GitHub 用戶名> -p <GITHUB_TOKEN>

# 2. 拉取最新映像
docker pull ghcr.io/<你的 GitHub 用戶名>/mall-client:v1.0.0

# 3. 運行容器
docker run -d \
  --name mall-client \
  -p 3000:80 \
  ghcr.io/<你的 GitHub 用戶名>/mall-client:v1.0.0
```

### 3. 本地 Docker 建置

```bash
# 建置映像
docker build -t mall-client .

# 本地運行測試
docker run -d --name mall-client -p 3000:80 mall-client
```

## 環境變數

專案使用 Vite 的環境變數系統來區分開發與生產環境的 API 設定。

### 設定檔案說明

| 檔案 | 用途 | 是否加入 Git |
|------|------|--------------|
| `.env` | 本地開發環境設定 | ❌ 否 |
| `.env.production` | 生產環境建置設定 | ❌ 否 |

### 建立環境變數檔案

**本地開發 (`.env`)：**
```env
VITE_API_BASE_URL=https://localhost:7175
```

**生產環境 (`.env.production`)：**
```env
VITE_API_BASE_URL=https://api.your-domain.com
```

### 使用方式

```typescript
// src/services/Request.ts
const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://localhost:7175'
}
```

### 運作原理

- `npm run dev` → 使用 `.env` 的設定
- `npm run build` → 使用 `.env.production` 的設定（並將值編譯進打包後的 JS）

**注意**：`.env` 和 `.env.production` 不需要上傳到伺服器，環境變數在**建置時**就已嵌入最終檔案。只需要部署 `dist` 目錄或 Docker 映像即可。

## 路由認證

- **公開頁面**: `/login`, `/signup`, `/reset-password`, `/about`
- **需登入頁面**: `/shopping-cart`, `/confirm-order`, `/my-orders`, `/profile`
- 路由守衛自動檢查登入狀態，未登入用戶將被重定向至登入頁

## 響應式設計斷點

| 斷點 | 寬度 | 說明 |
|------|------|------|
| Desktop XL | ≥1600px | 超大螢幕 |
| Desktop | ≥1200px | 桌面 |
| Tablet | ≤768px | 平板/手機橫向 |
| Mobile | ≤500px | 手機 |
| Small Mobile | ≤375px | 小手機 |

## 授權條款

```
Manian 電商前台客戶端
Copyright (C) 2026

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
```

完整的 GNU GPL v3 授權條款請見 [GNU Licenses](https://www.gnu.org/licenses/gpl-3.0.html)。
