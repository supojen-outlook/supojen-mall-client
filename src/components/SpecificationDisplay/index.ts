import type { App } from 'vue'
import SpecificationDisplay from './SpecificationDisplay.vue'

export default {
  install(app: App) {
    app.component('SpecificationDisplay', SpecificationDisplay)
  }
}

export { SpecificationDisplay }
