import type { App, Plugin } from 'vue'
import PaymentMethodSectionComponent from './PaymentMethodSection.vue'

/**
 * 封裝為 Vue 插件，支援全域註冊
 * 使用方式：app.use(PaymentMethodSection)
 */
const PaymentMethodSection = {
  ...PaymentMethodSectionComponent,
  install: (app: App) => {
    app.component('PaymentMethodSection', PaymentMethodSectionComponent)
  }
} as unknown as Plugin & typeof PaymentMethodSectionComponent

export default PaymentMethodSection
export { PaymentMethodSection }
