import type { App } from 'vue'
import ProductInfo from './ProductInfo.vue'

export default {
  install(app: App) {
    app.component('ProductInfo', ProductInfo)
  }
}

export { ProductInfo }
