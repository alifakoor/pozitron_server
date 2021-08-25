import axios from 'axios'
import authHeader from '../services/auth.header'
import config from '@/config'

const API_URL = config.api.server + 'api/settings/'

export const settings = {
    namespaced: true,
    state: {
        userWebsite: {
            _address: null,
            _consumer_key: null,
            _consumer_secret: null
        },
        sync: {
            categories: false,
            products: false,
            variations: false,
            orders: false
        }
    },
    getters: {

    },
    actions: {
        getUserWebsiteData ({ commit }, userId) {
            return axios.post(API_URL + 'get_user_website', { id: userId }, { headers: authHeader() }).then((res) => {
                if (res.status) {
                    commit('setUserWebsiteData', res.data)
                }
            }).catch(err => console.log(err))
        },
        setUserWebsiteData ({ commit }, websiteData) {
            return axios.post(API_URL + 'set_user_website', websiteData, { headers: authHeader() }).then((res) => {
                if (res.status) {
                    return true
                }
            }).catch(err => console.log(err))
        },
        syncCategories ({ commit }) {
            return axios.post(API_URL + 'sync_categories', {}, { headers: authHeader() })
                .then((res) => {
                    if (res.status) {
                        console.log(res.data)
                        commit('categoriesSynced')
                    }
                })
                .catch(err => console.log(err))
        },
        syncProducts ({ commit }) {
            return axios.post(API_URL + 'sync_products', {}, { headers: authHeader() }).then((res) => {
                if (res.status) {
                    console.log(res.data)
                    commit('productsSynced')
                }
            }).catch(err => console.log(err))
        },
        syncProductVariations ({ commit }) {
            return axios.post(API_URL + 'sync_product_variations', {}, { headers: authHeader() }).then((res) => {
                if (res.status) {
                    console.log(res.data)
                    commit('variationsSynced')
                }
            }).catch((err) => {
                console.log(err)
            })
        },
        syncOrders ({ commit }) {
            return axios.post(API_URL + 'sync_orders', {}, { headers: authHeader() }).then((res) => {
                if (res.status) {
                    console.log(res.data)
                    commit('ordersSynced')
                }
            }).catch((err) => {
                console.log(err)
            })
        }
    },
    mutations: {
        setUserWebsiteData (state, userMeta) {
            state.userWebsite = userMeta
        },
        categoriesSynced (state) {
            state.sync.categories = true
        },
        productsSynced (state) {
            state.sync.products = true
        },
        variationsSynced (state) {
            state.sync.variations = true
        },
        ordersSynced (state) {
            state.sync.orders = true
        }
    }
}
