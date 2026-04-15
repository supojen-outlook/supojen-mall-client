import type { App, Plugin } from 'vue'
import CartSummarySectionComponent from './CartSummarySection.vue'

/**
 * 封裝為 Vue 插件，支援全域註冊
 * 使用方式：app.use(CartSummarySection)
 */
const CartSummarySection = {
  ...CartSummarySectionComponent,
  install: (app: App) => {
    app.component('CartSummarySection', CartSummarySectionComponent)
  }
} as unknown as Plugin & typeof CartSummarySectionComponent

export default CartSummarySection
export { CartSummarySection }
