import type { App } from 'vue'
import SkuSelector from './SkuSelector.vue'

export default {
  install(app: App) {
    app.component('SkuSelector', SkuSelector)
  }
}

export { SkuSelector }
