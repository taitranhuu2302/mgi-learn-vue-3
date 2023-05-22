import './assets/base.css'

import { createApp } from 'vue'
import App from './App.vue'
import clickOutside from '@/directives/ClickOutside'

const app = createApp(App)

app.directive('click-outside', clickOutside)
app.mount('#app')
