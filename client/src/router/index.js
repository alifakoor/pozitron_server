import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/auth/Login.vue'
import Register from '../views/auth/Register.vue'
import Panel from '../views/panel/Panel.vue'

// Dashboard
import Dashboard from '../views/panel/Dashboard.vue'

// Settings
import Settings from '../views/panel/Settings'

// Products
import Products from '../views/panel/products/All.vue'
// import AllProducts from '../views/panel/products/All.vue'
// import SyncProducts from '../views/panel/products/SyncProducts.vue'

// Categories
import Categories from '../views/panel/categories/Categories.vue'
import AllCategories from '../views/panel/categories/All.vue'
import SyncCategories from '../views/panel/categories/SyncCategories.vue'

// Stations
import Stations from '../views/panel/Stations.vue'
import Station from '../views/panel/stations/Station.vue'
// import StationCart from '../views/panel/stations/Cart.vue'

// Orders
import Invoices from '../views/panel/invoices/Invoices.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/register',
        name: 'Register',
        component: Register
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: {
            title: 'ورود'
        }
    },
    {
        path: '/panel',
        name: 'Panel',
        component: Panel,
        meta: {
            title: 'پنل'
        },
        children: [
            {
                path: '',
                component: Dashboard
            },
            {
                path: 'products',
                component: Products,
                meta: {
                    title: 'محصولات'
                }
            },
            {
                path: 'categories',
                component: Categories,
                meta: {
                    title: ' | دسته بندی ها'
                },
                children: [
                    {
                        path: '',
                        component: AllCategories
                    },
                    {
                        path: 'sync',
                        component: SyncCategories
                    }
                ]
            },
            {
                path: 'stations',
                component: Stations,
                meta: {
                    title: 'صندوق'
                }
            },
            {
                path: 'station/:username',
                component: Station,
                meta: {
                    title: 'صندوق'
                }
            },
            {
                path: 'invoices',
                component: Invoices,
                meta: {
                    title: 'سفارشات'
                }
            },
            {
                path: 'settings',
                name: 'Settings',
                component: Settings
            }
        ]
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    linkExactActiveClass: 'active',
    routes
})

router.beforeEach((to, from, next) => {
    document.title = 'آنلاین نو پوز | ' + to.meta.title
    const publicPages = ['/login', '/register']
    const authRequired = !publicPages.includes(to.path)
    const loggedIn = localStorage.getItem('user')
    if (authRequired && !loggedIn) {
        next('/login')
    } else {
        next()
    }
})

export default router
