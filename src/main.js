import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

import HomeQR from './views/HomeQR.vue'
import ClienteLealtad from './views/ClienteLealtad.vue'
import AdminBelliDiel from './views/AdminBelliDiel.vue'

const routes = [
  { 
    path: '/', 
    name: 'Home',
    component: HomeQR 
  },
  { 
    path: '/lealtad', 
    name: 'Lealtad',
    component: ClienteLealtad 
  },
  { 
    path: '/admin-bellidiel', 
    name: 'AdminBelliDiel',
    component: AdminBelliDiel 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')