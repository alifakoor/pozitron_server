import axios from 'axios'
import authHeader from '../services/auth.header'
import config from '@/config'

const API_URL = config.api.server + 'api/invoices/'

export const invoice = {
    namespaced: true,
    state: {
        invoices: [],
        currentInvoice: null,
        selectedList: [],
        showStatesForCurrent: false,
        users: []
    },
    getters: {
        getAllInvoices (state) {
            return state.invoices
        },
        getCurrentInvoice (state) {
            return state.currentInvoice
        },
        getSelectedList (state) {
            return state.selectedList
        },
        getshowStatesForCurrent (state) {
            return state.showStatesForCurrent
        },
        getUsers (state) {
            return state.users
        }
    },
    actions: {
        getAllInvoices ({ commit }) {
            return axios.get(API_URL + 'all', { headers: authHeader() }).then((res) => {
                if (res.data.success) {
                    commit('setAllInvoices', res.data.invoices)
                    commit('setUsers', res.data.users)
                }
            }).catch((err) => {
                console.log(`get all invoice faild with error: ${err}`)
            })
        }
    },
    mutations: {
        setAllInvoices (state, invoices) {
            state.invoices = invoices
        },
        setCurrentInvoice (state, invoice) {
            state.currentInvoice = invoice
        },
        setSelectedList (state, invoice) {
            state.selectedList.push(invoice)
        },
        emptySelectedList (state) {
            state.selectedList = []
        },
        changeShowStateForInvoice (state) {
            state.showStatesForCurrent = !state.showStatesForCurrent
        },
        setUsers (state, users) {
            state.users = users
        }
    }
}
