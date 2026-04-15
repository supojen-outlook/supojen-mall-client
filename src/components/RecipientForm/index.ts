import type { App, Plugin } from 'vue'
import RecipientFormComponent from './RecipientForm.vue'

/**
 * 封裝為 Vue 插件，支援全域註冊
 * 使用方式：app.use(RecipientForm)
 */
const RecipientForm = {
  ...RecipientFormComponent,
  install: (app: App) => {
    app.component('RecipientForm', RecipientFormComponent)
  }
} as unknown as Plugin & typeof RecipientFormComponent

export default RecipientForm
export { RecipientForm }
