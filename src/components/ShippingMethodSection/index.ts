import type { App, Plugin } from 'vue'
import ShippingMethodSectionComponent from './ShippingMethodSection.vue'

/**
 * 封裝為 Vue 插件，支援全域註冊
 * 使用方式：app.use(ShippingMethodSection)
 */
const ShippingMethodSection = {
  ...ShippingMethodSectionComponent,
  install: (app: App) => {
    app.component('ShippingMethodSection', ShippingMethodSectionComponent)
  }
} as unknown as Plugin & typeof ShippingMethodSectionComponent

export default ShippingMethodSection
export { ShippingMethodSection }
