import type { App, Plugin } from 'vue'
import CartItemRowComponent from './CartItemRow.vue'

/**
 * 封裝為 Vue 插件，支援全域註冊
 * 使用方式：app.use(CartItemRow)
 */
const CartItemRow = {
  ...CartItemRowComponent,
  install: (app: App) => {
    app.component('CartItemRow', CartItemRowComponent)
  }
} as unknown as Plugin & typeof CartItemRowComponent

export default CartItemRow
export { CartItemRow }
