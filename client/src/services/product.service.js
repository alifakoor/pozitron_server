import axios from 'axios'

const API_URL = 'http://194.5.193.70:8081/api/products/'

class ProductService {
    syncProducts (consumer) {
        return axios
            .post(API_URL + 'sync', {
                consumerKey: consumer.key,
                consumerSecret: consumer.secret
            })
            .then(res => { return res.data })
            .catch(err => { return err })
    }
}

export default new ProductService()
