import type { App, Plugin } from 'vue'
import TopNavBarComponent from './TopNavBar.vue'

/**
 * 封裝為 Vue 插件，支援全域註冊
 * 使用方式：app.use(TopNavBar)
 */
const TopNavBar = {
  ...TopNavBarComponent,
  install: (app: App) => {
    app.component('TopNavBar', TopNavBarComponent)
  }
} as unknown as Plugin & typeof TopNavBarComponent

export default TopNavBar
export { TopNavBar }
