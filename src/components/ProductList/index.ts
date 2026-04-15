import type { App, Plugin } from 'vue'
import ProductListComponent from './ProductList.vue'

/**
 * 封裝為 Vue 插件，支援全域註冊
 * 使用方式：app.use(ProductList)
 */
const ProductList = {
  ...ProductListComponent,
  install: (app: App) => {
    app.component('ProductList', ProductListComponent)
  }
} as unknown as Plugin & typeof ProductListComponent

export default ProductList
export { ProductList }
