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
        syncVariableProducts () {
            return axios.post(API_URL + 'sync_variable_products', {}, { headers: authHeader() }).then((res) => {
                console.log(res)
            }).catch((err) => {
                console.log(err)
            })
        },
        syncProducts ({ commit }) {
            return axios.post(API_URL + 'sync_products', {}, { headers: authHeader() }).then((res) => {
                if (res.status) {
                    console.log(res)
                }
            }).catch(err => console.log(err))
        }
    },
    mutations: {
        setUserWebsiteData (state, userMeta) {
            state.userWebsite = userMeta
        }
    }
}
