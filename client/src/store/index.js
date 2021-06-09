import Vue from 'vue'
import Vuex from 'vuex'

// authentication
import { auth } from './auth.module'

// settings
import { settings } from './settings.module'

// product
import { product } from './product.module'

// category
import { category } from './category.module'

// order
import { order } from './order.module'

// invoice
import { invoice } from './invoice.module'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
    },
    getters: {
    },
    actions: {
    },
    mutations: {
    },
    modules: {
        auth,
        settings,
        product,
        category,
        order,
        invoice
    }
})
