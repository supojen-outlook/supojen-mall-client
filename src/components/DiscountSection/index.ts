import type { App, Plugin } from 'vue'
import DiscountSectionComponent from './DiscountSection.vue'

/**
 * 封裝為 Vue 插件，支援全域註冊
 * 使用方式：app.use(DiscountSection)
 */
const DiscountSection = {
  ...DiscountSectionComponent,
  install: (app: App) => {
    app.component('DiscountSection', DiscountSectionComponent)
  }
} as unknown as Plugin & typeof DiscountSectionComponent

export default DiscountSection
export { DiscountSection }
