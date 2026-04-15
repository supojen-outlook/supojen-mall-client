import type { App, Plugin } from 'vue'
import ProductCardComponent from './ProductCard.vue'

/**
 * 封裝為 Vue 插件，支援全域註冊
 * 使用方式：app.use(ProductCard)
 */
const ProductCard = {
  ...ProductCardComponent,
  install: (app: App) => {
    app.component('ProductCard', ProductCardComponent)
  }
} as unknown as Plugin & typeof ProductCardComponent

export default ProductCard
export { ProductCard }
