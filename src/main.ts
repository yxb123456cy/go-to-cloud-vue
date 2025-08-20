import { createApp } from 'vue'
import App from './App.vue'
import MainLayout from './layout/MainLayout.vue'
import router from './router'
import pinia from './store'
import './style.css'
import '@arco-design/web-vue/dist/arco.css'
// 导入UnoCSS样式
import 'uno.css'

const app = createApp(App)
app.component('MainLayout', MainLayout)
app.use(router)
app.use(pinia)
app.mount('#app')
