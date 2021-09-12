import axios from 'axios'
import authHeader from '../services/auth.header'
import config from '@/config'

const API_URL = config.api.server + 'api/orders/'

const emptyCustomer = () => {
    return {
        fullname: null,
        phone: null,
        email: null,
        address: null
    }
}

const emptyCurrentOrder = () => {
    return {
        details: null,
        items: null,
        order_meta: {
            addition: 0,
            discount: 0,
            shipping: 0,
            delivery: null
        },
        outOfStock: null,
        description: null
    }
}

const state = {
    requiredPass: {
        phone: null,
        name: null,
        email: null
    },
    orders: null,
    savedCart: null,
    prevCarts: null,
    customer: emptyCustomer(),
    currentOrder: emptyCurrentOrder(),
    prevOrders: [],
    inPaymentOrder: {
        details: null,
        items: null,
        done: false
    }
}

const getters = {
    getCustomer (state) {
        return state.customer
    },
    getCurrentOrder (state) {
        return state.currentOrder
    },
    getOutOfStock (state) {
        return state.currentOrder.outOfStock
    },
    getPrevOrders (state) {
        return state.prevOrders
    },
    getInPaymentOrder (state) {
        return state.inPaymentOrder
    }
}

const actions = {
    saveCurrentOrder ({ commit }, data) {
        return axios.post(API_URL + 'save_current_order', data, { headers: authHeader() }).then((res) => {
            if (res.data.success) {
                commit('updatePreviousOrderItems', res.data.order)
            }
        })
    },
    saveCart ({ commit }, data) {
        return axios.post(API_URL + 'save_cart', data, { headers: authHeader() }).then((res) => {
            commit('saveCart', res)
            return Promise.resolve(res)
        })
    },
    getPreviousOrders ({ commit }) {
        return axios.get(API_URL + 'previous_orders', { headers: authHeader() }).then((res) => {
            commit('setPrevOrders', res.data)
        })
    },
    completeCart ({ commit }, data) {
        return axios.post(API_URL + 'complete_cart', data, { headers: authHeader() }).then((res) => {
            commit('completeCart', res)
            return Promise.resolve(res)
        })
    },
    getCustomer ({ commit }, data) {
        return axios.post(API_URL + 'get_customer', data, { headers: authHeader() }).then((res) => {
            if (res.data.success) {
                commit('setCustomer', res.data.customer)
                return false
            }
            commit('nullCurrentCustomerName')
            return true
        })
    },
    createOrder ({ commit }, data) {
        return axios.post(API_URL + 'create', data, { headers: authHeader() }).then((res) => {
            if (res.data.success) {
                commit('pushNewOrderToPrevOrders', res.data.order)
                commit('setCurrentOrder', res.data.order)
            }
        })
    },
    deleteOrder ({ commit }, data) {
        return axios.post(API_URL + 'delete', data, { headers: authHeader() }).then((res) => {
            if (res.data.success) {
                commit('removeCurrentOrder', data)
            }
        })
    },
    saveOrder ({ commit }, data) {
        return axios.post(API_URL + 'save', data.currentOrder, { headers: authHeader() }).then((res) => {
            if (res.data.success) {
                commit('pushToPrevOrders', data.order)
                commit('nullCurrentOrder')
            }
        })
    },
    payOrder ({ commit }, data) {
        return axios.post(API_URL + 'pay', data, { headers: authHeader() }).then((res) => {
            if (res.status) {
                commit('orderPayed')
                commit('removeOrderFromPreviousOrders', data.details.id)
                // commit('nullCurrentOrder')
                return true
            }
        })
    },
    deleteItemFromCurrentOrder ({ commit }, item) {
        return axios.post(API_URL + 'delete_item_from_order', item, { headers: authHeader() }).then((res) => {
            if (res.data.success) {
                commit('removeFromCurrentOrder', item)
            }
        })
    }
}

const mutations = {
    saveCart (state, cart) {
        this.state.savedCart = cart
    },
    setPrevOrders (state, orders) {
        state.prevOrders = orders
    },
    setCustomer (state, customer) {
        customer.phone = '0' + customer.phone
        state.customer = customer
    },
    setCurrentOrder (state, order) {
        state.currentOrder.details = {
            id: order.id,
            order_key: order.order_key,
            total_price: order.total_price,
            status: order.status,
            type: order.type,
            userId: order.userId,
            customerId: order.customerId
        }
        state.currentOrder.items = []
        state.currentOrder.order_meta = order.order_meta
    },
    addToCurrentOrder (state, newItem) {
        if (state.currentOrder.items) {
            const itemExist = state.currentOrder.items.find(item => {
                if (item.productId === newItem.productId) {
                    item.count++
                    state.currentOrder.details.total_price += newItem.price
                    state.currentOrder.outOfStock = null
                    return item
                }
                return null
            })
            if (!itemExist) {
                state.currentOrder.items.push(newItem)
                state.currentOrder.details.total_price += newItem.price
                state.currentOrder.outOfStock = null
            }
        } else {
            state.currentOrder.items = [newItem]
            state.currentOrder.details.total_price += newItem.price
        }
    },
    removeFromCurrentOrder (state, product) {
        let items = state.currentOrder.items
        items.find((item) => {
            if (item.id === product.id) {
                state.currentOrder.details.total_price -= (item.price * item.count)
                items = items.filter((element) => {
                    return element.id !== item.id
                })
            }
        })
        state.currentOrder.items = items
    },
    plusToCurrentOrder (state, id) {
        const items = state.currentOrder.items
        items.map(item => {
            if (item.id === id) {
                item.total_stock--
                item.count++
                state.currentOrder.details.total_price += item.price
            }
        })
    },
    minusFromCurrentOrder (state, id) {
        const items = state.currentOrder.items
        items.find((item) => {
            if (item.id === id) {
                if (item.count > 1) {
                    item.total_stock++
                    item.count--
                    state.currentOrder.details.total_price -= item.price
                }
            }
        })
        state.currentOrder.items = items
    },
    removeCurrentOrder (state, data) {
        state.prevOrders = state.prevOrders.filter(order => {
            return order.id !== data.id
        })
        Object.assign(state.customer, emptyCustomer())
        Object.assign(state.currentOrder, emptyCurrentOrder())
    },
    pushToPrevOrders (state, order) {
        state.prevOrders.push(order)
    },
    pushNewOrderToPrevOrders (state, order) {
        order.customer = state.customer
        state.prevOrders.push(order)
    },
    nullCurrentOrder (state) {
        state.currentOrder.details = null
        state.currentOrder.items = null
        state.currentOrder.outOfStock = null
        state.currentOrder.order_meta = {
            addition: 0,
            discount: 0,
            shipping: 0,
            delivery: null
        }
    },
    nullCurrentCustomer (state) {
        Object.assign(state.customer, emptyCustomer())
    },
    nullCurrentCustomerName (state) {
        state.customer.fullname = null
    },
    removeOrderFromPreviousOrders (state, id) {
        state.prevOrders = state.prevOrders.filter(order => {
            return order.id !== id
        })
        Object.assign(state.currentOrder, emptyCurrentOrder())
    },
    loadItemOfCurrentOrder (state, item) {
        if (state.currentOrder.items) {
            state.currentOrder.items.push(item)
        } else {
            state.currentOrder.items = [item]
        }
    },
    inPaymentOrder (state, order) {
        state.inPaymentOrder.details = order.details
        state.inPaymentOrder.items = order.items
    },
    orderPayed (state) {
        state.inPaymentOrder.done = true
    },
    newOrderAfterPay (state) {
        Object.assign(state.customer, emptyCustomer())
        state.inPaymentOrder.details = null
        state.inPaymentOrder.items = null
        state.inPaymentOrder.done = false
    },
    plusShipping (state, value) {
        state.currentOrder.meta.shipping = value
        // state.currentOrder.details.total_price += value
    },
    minusShipping (state, value) {
        state.currentOrder.meta.shipping = value
        // state.currentOrder.details.total_price -= value
    },
    plusDiscount (state, value) {
        state.currentOrder.meta.discount = value
        // const totalPrice = state.currentOrder.details.total_price
        // state.currentOrder.details.total_price -= parseInt(( totalprice * value ) / 100 )
    },
    minusDiscount (state, value) {
        state.currentOrder.meta.discount = value
    },
    setShipping (state, value) {
        state.currentOrder.order_meta._shipping = value
    },
    setDiscount (state, value) {
        state.currentOrder.order_meta._discount = value
    },
    setAddition (state, value) {
        state.currentOrder.order_meta._addition = value
    },
    backToOrder (state) {
        state.inPaymentOrder.details = null
        state.inPaymentOrder.items = null
    },
    updatePreviousOrderItems (state, order) {
        console.log(order)
        state.prevOrders.find(previousOrder => {
            if (previousOrder.id === order.id) {
                previousOrder.items = order.items
            }
        })
    }
}

export const order = {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
