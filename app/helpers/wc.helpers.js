// Woocommerce Rest API module
const WoocommerceRestApi = require('@woocommerce/woocommerce-rest-api').default

class WcHelpers {
    constructor(url, consumerKey, consumerSecret) {
        this.url = url
        this.consumerKey = consumerKey
        this.consumerSecret = consumerSecret
        this.api = new WoocommerceRestApi({
            url,
            consumerKey,
            consumerSecret,
            wpAPI: true,
            version: 'wc/v3'
        })
    }
    check(callback) {
        this.api.get('')
            .then(res => {
                if (res.status === 200 && res.statusText === 'OK') {
                    callback(true)
                }
            })
            .catch(error => {
                console.log(`wc helper error: ${error}`)
                callback(true)
            })
    }
    async getAllProducts() {
        let products = []
        let totalProducts = 0
        let totalPages = 1
        for (let page = 1; page <= totalPages; page++) {
            await this.api.get('products',
                {
                    page: page,
                    per_page: 100,
                    orderby: 'id',
                    order: 'asc'
                })
                .then(res => {
                    if (res.status === 200 && res.statusText === 'OK') {
                        if (page === 1) {
                            totalPages = res.headers['x-wp-totalpages']
                            totalProducts = res.headers['x-wp-total']
                        }
                        products.push(...res.data)
                    }
                })
                .catch(error => {
                    products = []
                    console.log(`wc helper error, getProduct:\n${error}`)
                })
        }

        let variationsID = products
            .filter(product => product.type === 'variable')
            .map(product => product.variations)
            .flat()

        let variations = []
        for (let id of variationsID) {
            await this.api.get(`products/${id}`,
                {
                    per_page: 100,
                    orderby: 'id',
                    order: 'asc'
                })
                .then(res => {
                    if (res.status === 200 && res.statusText === 'OK') {
                        variations.push(res.data)
                    }
                })
                .catch(error => {
                    variations = []
                    console.log(`wc helper error, get variations product:\n${error}`)
                })
        }
        return {
            products,
            variations
        }
    }
}

// export helper
module.exports = WcHelpers