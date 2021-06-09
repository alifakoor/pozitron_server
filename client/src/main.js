import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import JQuery from 'jquery'
import 'bootstrap'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import jalali from 'vue-jalali-moment'

Vue.config.productionTip = false

window.$ = JQuery

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(jalali)
document.title = 'آنلاین نو پوز'
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
