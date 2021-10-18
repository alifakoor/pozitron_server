const Woocommerce = require('@woocommerce/woocommerce-rest-api').default
const wc_api = new Woocommerce({
	url: "https://onlinenow.ir/sandbox-onlinenow-pos",
	consumerKey: 'ck_29d64cda057996705c71b39996c11b436bde8727',
	consumerSecret: 'cs_d608c1e47d1d55b35480ce9759b1c1609abe1899',
	version: "wc/v3"
})
module.exports = wc_api