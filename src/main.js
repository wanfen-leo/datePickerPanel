import { createApp } from 'vue'
import * as Element from './app'
import App from './App.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
let app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
Element.install(app)
app.mount('#app')
