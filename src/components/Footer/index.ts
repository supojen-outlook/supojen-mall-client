import type { App } from 'vue'
import Footer from './Footer.vue'

export default {
  install(app: App) {
    app.component('Footer', Footer)
  }
}

export { Footer }
