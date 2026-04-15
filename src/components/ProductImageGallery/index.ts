import type { App } from 'vue'
import ProductImageGallery from './ProductImageGallery.vue'

export default {
  install(app: App) {
    app.component('ProductImageGallery', ProductImageGallery)
  }
}

export { ProductImageGallery }
