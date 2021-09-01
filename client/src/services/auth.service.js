import axios from 'axios'
import config from '@/config'

const API_URL = config.api.server + 'api/auth/'

class AuthService {
    login (user) {
        return axios
            .post(API_URL + 'signin', {
                username: user.username,
                password: user.password,
                subdomain: user.subdomain
            })
            .then(response => {
                if (response.status === 200 && response.data.token) {
                    sessionStorage.setItem('user', JSON.stringify(response.data))
                }

                return response.data
            })
    }

    logout () {
        sessionStorage.removeItem('user')
    }

    register (user) {
        return axios.post(API_URL + 'signup', {
            username: user.username,
            phone: user.phone,
            password: user.password,
            subdomain: user.subdomain
        }).then(response => {
            return response
        }).catch(err => {
            console.log(err)
        })
    }
}

export default new AuthService()
