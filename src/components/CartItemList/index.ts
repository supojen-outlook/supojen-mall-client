import type { App, Plugin } from 'vue'
import CartItemListComponent from './CartItemList.vue'

/**
 * 封裝為 Vue 插件，支援全域註冊
 * 使用方式：app.use(CartItemList)
 */
const CartItemList = {
  ...CartItemListComponent,
  install: (app: App) => {
    app.component('CartItemList', CartItemListComponent)
  }
} as unknown as Plugin & typeof CartItemListComponent

export default CartItemList
export { CartItemList }
