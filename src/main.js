import {createRouter, createWebHashHistory, createWebHistory} from 'vue-router'
import { createApp } from 'vue'
import App from './App.vue'
import naive from 'naive-ui'
const app = createApp(App)

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/about', name:'About', component: () => import ('./About.vue') },
    { path: '/login', name:'Login', component: () => import ('./Login.vue') },
    { path: '/book', name:'Book', component: () => import ('./Book.vue') },
    { path: '/log', name:'Log', component: () => import ('./Log.vue') },
]
const router = createRouter({
    history: process.env.IS_ELECTRON ? createWebHashHistory() : createWebHistory(),
    routes,
})
app.use(router)
app.use(naive)

app.mount('#app')