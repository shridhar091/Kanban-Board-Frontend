import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'vue3-toastify/dist/index.css'
import Vue3Toastify from 'vue3-toastify'

// createApp(App).mount('#app')
const app = createApp(App)
app.use(Vue3Toastify, {
  autoClose: 2000, 
  theme: "colored",
  position: "bottom-right",
})
app.mount('#app')