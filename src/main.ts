import { VueQueryPlugin } from '@tanstack/vue-query'
import { createApp } from 'vue'
import App from './App.vue'
import { queryClient } from './api/queryClient'
import { router } from './router'
import 'vue-sonner/style.css'
import './style.css'

createApp(App).use(router).use(VueQueryPlugin, { queryClient }).mount('#app')
