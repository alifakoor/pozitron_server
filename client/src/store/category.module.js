import axios from 'axios'
import authHeader from '../services/auth.header'
import config from '@/config'

const API_URL = config.api.server + 'api/categories/'

export const category = {
    namespaced: true,
    state: {
        syncCategories: false,
        categories: null
    },
    getters: {
        getAllCategories (state) {
            return state.categories
        }
    },
    actions: {
        getAllCategories ({ commit }) {
            return axios.post(API_URL + 'all', {}, { headers: authHeader() })
                .then((res) => {
                    commit('setAllCategories', res.data)
                    // return Promise.resolve(res)
                })
                .catch((err) => { console.log(err) })
        },
        syncCategories ({ commit }) {
            return axios
                .post(API_URL + 'sync', {}, { headers: authHeader() })
                .then((res) => {
                    commit('syncSuccess', res)
                    return Promise.resolve(res)
                })
                .catch((err) => { return err })
        }
    },
    mutations: {
        setAllCategories (state, categories) {
            state.categories = categories
        },
        syncSuccess (state, categories) {
            this.state.syncCategories = true
            this.state.categories = categories
        }
    }
}
