import axios from 'axios'
import authHeader from '../services/auth.header'
import config from '@/config'
import SocketConnection from '../services/socket.service'
const socket = new SocketConnection()

const API_URL = config.api.server + 'api/products/'

const emptyForm = () => {
    return {
        type: null,
        simple: {
            images: [],
            index_image: null,
            big_image: null,
            sku: null,
            name: null,
            price: 0,
            barcode: 0,
            discount: {
                value: 0,
                selected: 'cash',
                options: [
                    { text: '%', value: 'percent' },
                    { text: 'هـ.ت', value: 'cash' }
                ]
            },
            stock: {
                value: 0,
                selected: 'number',
                options: [
                    { text: '∞', value: 'infinity' },
                    { text: 'عـدد', value: 'number' }
                ]
            },
            size: {
                length: null,
                width: null,
                height: null
            },
            weight: null,
            online_sell: false,
            online_price: 0,
            online_discount: {
                value: 0,
                selected: 'cash',
                options: [
                    { text: '%', value: 'percent' },
                    { text: 'هـ.ت', value: 'cash' }
                ]
            },
            online_stock: 0,
            permalink: null,
            description: null,
            categories: [],
            tags: []
        },
        variable: {
            images: [],
            index_image: null,
            big_image: null,
            sku: null,
            name: null,
            permalink: null,
            description: null,
            categories: [],
            tags: [],
            attributes: {
                name: null,
                value: null,
                position: 0,
                visible: true,
                variation: true,
                options: []
            },
            variations: {
                fields: [
                    { key: 'sku', label: 'شناسه' },
                    { key: 'variation', label: 'متغیر' },
                    { key: 'select' }
                ],
                items: []
            }
        },
        variation: {
            images: [],
            index_image: null,
            big_image: null,
            sku: null,
            name: null,
            parentId: null,
            price: 0,
            barcode: 0,
            discount: {
                value: 0,
                selected: 'cash',
                options: [
                    { text: '%', value: 'percent' },
                    { text: 'هـ.ت', value: 'cash' }
                ]
            },
            stock: {
                value: 0,
                selected: 'number',
                options: [
                    { text: '∞', value: 'infinity' },
                    { text: 'عـدد', value: 'number' }
                ]
            },
            size: {
                length: null,
                width: null,
                height: null
            },
            weight: null,
            online_sell: false,
            online_price: 0,
            online_discount: {
                value: 0,
                selected: 'cash',
                options: [
                    { text: '%', value: 'percent' },
                    { text: 'هـ.ت', value: 'cash' }
                ]
            },
            online_stock: 0,
            permalink: null
        }
    }
}

const initialState = () => {
    return {
        syncProducts: false,
        products: null,
        manageStock: false,
        globalSearch: {
            values: null,
            categories: []
        },
        uploaded: [],
        table: {
            busy: false
        },
        attributes: {
            selected: null,
            options: [
                {
                    value: null,
                    text: 'متغیر پیش فرض',
                    items: []
                },
                {
                    value: 'color',
                    text: 'رنگ',
                    items: [
                        { value: null, text: '' },
                        { value: 'blue', text: 'آبی' },
                        { value: 'red', text: 'قرمز' },
                        { value: 'green', text: 'سبز' }
                    ]
                },
                {
                    value: 'size',
                    text: 'سایز',
                    items: [
                        { value: null, text: '' },
                        { value: 10, text: '10' },
                        { value: 15, text: '15' },
                        { value: 20, text: '20' }
                    ]
                }
            ]
        },
        newProduct: emptyForm()
    }
}

const state = initialState()

const getters = {
    getAllProducts (state) {
        return state.products
    },
    getGlobalSearch (state) {
        return state.globalSearch
    },
    getUploaded (state) {
        return state.uploaded
    }
}

const actions = {
    getAllProducts ({ commit }) {
        return axios.post(API_URL + 'all', {}, { headers: authHeader() })
            .then((res) => {
                commit('setAllProducts', res.data)
            })
            .catch((err) => { console.log(err) })
    },
    getAllProductsForCart ({ commit }) {
        socket.sendEvent({ type: 'getAllProductsForCart', data: {} })
        socket.addEventListener({
            type: 'allProductsForCart',
            callback: res => {
                commit('setAllProductsForCart', res)
                // socket.disconnect()
            }
        })

        /*
        return axios.post(API_URL + 'cart', {}, { headers: authHeader() })
            .then((res) => {
                commit('setAllProductsForCart', res.data)
                // return Promise.resolve(res)
            })
            .catch((err) => { console.log(err) })
        */
    },
    updateProductStock ({ commit }, data) {
        socket.sendEvent({ type: 'updateProductStock', data: data })
    },
    syncProducts ({ commit }, consumer) {
        return axios
            .post(API_URL + 'sync', {}, { headers: authHeader() })
            .then((res) => {
                commit('syncSuccess', res)
                return Promise.resolve(res)
            })
            .catch((err) => { return err })
    },
    manageStock ({ commit }, data) {
        return axios.post(API_URL + 'manage_stock', data, { headers: authHeader() }).then((res) => {
            commit('manageStock', res)
            return Promise.resolve(res)
        })
    },
    uploadImg ({ commit, state }, data) {
        return axios.post(config.api.server + 'api/general/upload_image', data, { headers: authHeader() })
            .then((res) => {
                commit('ImgUploaded', { url: res.data, type: state.newProduct.type })
            }).catch(err => console.log(`image was not uploaded, Error: ${err}`))
    },
    createNewProduct ({ commit, state }) {
        state.table.busy = true
        return axios.post(API_URL + 'create_new_product', state.newProduct, { headers: authHeader() })
            .then((res) => {
                if (res.status) return res.data
            }).catch((err) => { console.log(err) })
    },
    getOneProduct ({ commit }, productId) {
        return axios.post(API_URL + 'get_one_product', { id: productId }, { headers: authHeader() })
            .then((res) => {
                if (res.status) commit('setNewProduct', res.data)
            })
            .catch((err) => { console.log(err) })
    },
    deleteProduct ({ commit, state }) {
        state.table.busy = true
        return axios.post(API_URL + 'delete_product', state.newProduct, { headers: authHeader() })
            .then((res) => {
                if (res.status) {
                    commit('removeProductFromTable', res.data)
                    // commit('setNullNewProduct')
                }
            }).catch((err) => { console.log(err) })
    },
    deleteProductVariation ({ commit }, skus = []) {
        return axios.post(API_URL + 'delete_product_variation', skus, { headers: authHeader() })
            .then((res) => {
                if (res.status) {
                    commit('removeVariationsFromTable', res.data)
                    // commit('setNullNewProduct')
                }
            }).catch((err) => { console.log(err) })
    },
    manageOnlineSale ({ commit }, data) {
        state.table.busy = true
        return axios.post(API_URL + 'manage_online_sell', data, { headers: authHeader() })
            .then((res) => {
                if (res.status) state.table.busy = false
            }).catch((err) => { console.log(err) })
    }
}

const mutations = {
    setAllProducts (state, products) {
        state.products = products
    },
    setAllProductsForCart (state, products) {
        state.products = products
    },
    setCategoryForGlobalSearch (state, cat) {
        state.globalSearch.categories.push(cat)
    },
    syncSuccess (state, products) {
        this.state.syncProducts = true
        this.state.products = products
    },
    manageStock (state, manageStock) {
        this.state.manageStock = manageStock
    },
    globalSearch (state, values) {
        if (values.length && values[0].length) {
            state.globalSearch.has = true
            state.globalSearch.values = values
        } else {
            state.globalSearch.has = false
            state.globalSearch.values = null
        }
    },
    ImgUploaded (state, data) {
        if (data.type === 'simple' || data.type === 'editSimple') {
            if (!state.newProduct.simple.images.length) {
                state.newProduct.simple.index_image = data.url
                state.newProduct.simple.big_image = data.url
            }
            state.newProduct.simple.images.push(data.url)
        }
        if (data.type === 'variable' || data.type === 'editVariable') {
            if (!state.newProduct.variable.images.length) {
                state.newProduct.variable.index_image = data.url
                state.newProduct.variable.big_image = data.url
            }
            state.newProduct.variable.images.push(data.url)
        }
        if (data.type === 'productVariation') {
            if (!state.newProduct.variation.images.length) {
                state.newProduct.variation.index_image = data.url
                state.newProduct.variation.big_image = data.url
            }
            state.newProduct.variation.images.push(data.url)
        }
    },
    setNewProduct (state, data) {
        if (data.type === 'product_variation') {
            state.products.find(product => {
                if (product.id === data.parent_id) {
                    product.Children = product.Children.filter(child => {
                        return child.id !== data.id
                    })
                    product.Children.push(data)
                }
            })
        } else {
            state.products = state.products.filter(product => {
                return product.id !== data.id
            })
            state.products.push(data)
        }
        state.globalSearch.values = data.sku
        state.table.busy = false
        state.newProduct.type = null
    },
    setSimpleProduct (state, product) {
        state.newProduct.type = 'editSimple'
        state.newProduct.simple = product
    },
    setVariableProduct (state, product) {
        state.newProduct.type = 'editVariable'
        state.newProduct.variable = product
        state.attributes.selected = product.attributes.value
    },
    setProductVariation (state, product) {
        state.newProduct.type = 'productVariation'
        state.newProduct.variation = product
    },
    updatedProductStock (state, data) {
        state.products.find(product => {
            if (product.id === data.id) {
                product.product_meta._stock = JSON.stringify(data.stock)
            }
        })
    },
    removeProductFromTable (state, sku) {
        if (state.newProduct.type === 'productVariation') {
            state.products.find(product => {
                if (product.id === state.newProduct.variation.parentId) {
                    product.Children = product.Children.filter(child => {
                        return child.sku !== sku
                    })
                }
            })
            Object.assign(state.newProduct, emptyForm())
        }
        state.products = state.products.filter(product => {
            return product.sku !== sku
        })
        state.table.busy = false
    },
    removeVariationsFromTable (state, skus) {
        state.products.find(product => {
            if (product.id === state.newProduct.variable.id) {
                product.Children = product.Children.filter(child => {
                    return !skus.includes(child.sku)
                })
            }
        })
    },
    resetForm (state) {
        Object.assign(state.newProduct, emptyForm())
    }
}

export const product = {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
