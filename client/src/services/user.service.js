import axios from 'axios'
import authHeader from './auth-header'
import config from '@/config'

const API_URL = config + 'api/test/'
console.log(API_URL)

class UserService {
    getPublicContent () {
        return axios.get(API_URL + 'all')
    }

    getUserBoard () {
        return axios.get(API_URL + 'user', { headers: authHeader() })
    }

    getModeratorBoard () {
        return axios.get(API_URL + 'mod', { headers: authHeader() })
    }

    getAdminBoard () {
        return axios.get(API_URL + 'admin', { headers: authHeader() })
    }
}

export default new UserService()
