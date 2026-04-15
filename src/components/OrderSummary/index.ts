import type { App, Plugin } from 'vue'
import OrderSummaryComponent from './OrderSummary.vue'

/**
 * 封裝為 Vue 插件，支援全域註冊
 * 使用方式：app.use(OrderSummary)
 */
const OrderSummary = {
  ...OrderSummaryComponent,
  install: (app: App) => {
    app.component('OrderSummary', OrderSummaryComponent)
  }
} as unknown as Plugin & typeof OrderSummaryComponent

export default OrderSummary
export { OrderSummary }
