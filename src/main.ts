import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import pinia from './store';
import '@arco-design/web-vue/dist/arco.css';
import router from './router';
// 导入UnoCSS样式
import 'uno.css';

const app = createApp(App);
app.use(router);
app.use(pinia);
app.mount('#app');
