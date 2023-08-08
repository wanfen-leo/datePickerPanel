import { createApp } from 'vue'
import * as Element from './app'
import App from './App.vue'
let app = createApp(App)
Element.install(app)
app.mount('#app')
