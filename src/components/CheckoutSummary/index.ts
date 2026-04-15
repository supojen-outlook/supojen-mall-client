import type { App, Plugin } from 'vue'
import CheckoutSummaryComponent from './CheckoutSummary.vue'

/**
 * 封裝為 Vue 插件，支援全域註冊
 * 使用方式：app.use(CheckoutSummary)
 */
const CheckoutSummary = {
  ...CheckoutSummaryComponent,
  install: (app: App) => {
    app.component('CheckoutSummary', CheckoutSummaryComponent)
  }
} as unknown as Plugin & typeof CheckoutSummaryComponent

export default CheckoutSummary
export { CheckoutSummary }
