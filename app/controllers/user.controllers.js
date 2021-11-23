/**
 * Requirements
 */
const _ = require('lodash')
const DB = require("../models")
const WC = require('@woocommerce/woocommerce-rest-api').default

/**
 * Models
 */
const Op = DB.Sequelize.Op
const USER = DB.user
const USER_META = DB.usermeta
const TERM = DB.term
const TERM_RELATION = DB.termRelation
const PRODUCT = DB.product
const PRODUCT_META = DB.productmeta
const ORDER = DB.order
const ORDER_META = DB.ordermeta
const ORDER_ITEM = DB.orderItems

const user = {
    async getWebsiteData(userId) {
        return await USER_META.findAll({
            where: {
                userId: userId
            }
        }).then((founded_row) => {
            if (founded_row.length !== 0) {
                return _.chain(founded_row).keyBy('meta_key').mapValues('meta_value').value()
            } else {
                return false
            }
        }).catch(err => console.log(err))
    },
    createWcApi(websiteData) {
        return new WC ({
            url: "https://"+websiteData._address,
            consumerKey: websiteData._consumer_key,
            consumerSecret: websiteData._consumer_secret,
            version: websiteData._api_version
        })
    },
    createTerms(terms, business_id, callback) {
        terms.map((term) => {
            TERM.upsert({
                reference_id: term.id,
                name: term.name,
                description: term.description,
                slug: decodeURIComponent(term.slug),
                count: term.count,
                link: JSON.stringify(term._links),
                type: 'category',
                status: 'active',
                business_id: business_id
            },{
                returning: true
            }).then((created_term) => {
                created_term = created_term[0]
                if (term.parent !== 0) {
                    TERM.findOne({
                        where: { reference_id: term.parent }
                    }).then((founded_parent_row) => {
                        created_term.update({
                            parent_id: Number(founded_parent_row.id)
                        })
                    }).catch(err => {
                        throw new Error(`Parent Term Not Found, Error: ${err}`)
                    })
                }
            }).catch(err => {
                throw new Error(`Term Not Created, ERROR: ${err}`)
            })
        })
        callback()
    },
    createProducts(products, business_id, callback) {
        products.map((product) => {
            PRODUCT.upsert({
                reference_id: product.id,
                title: product.name,
                description: product.description,
                slug: product.slug,
                barcode: product.sku,
                type: product.type,
                status: product.status,
                business_id: business_id
            },{
                returning: true
            }).then((created_row) => {
                created_row = created_row[0]
                this.createProductMeta(product, created_row.id, () => {
                    if (product.categories.length > 0) {
                        product.categories.map(term => {
                            TERM.findOne({
                                where: { reference_id: term.id }
                            }).then((founded_term) => {
                                TERM_RELATION.upsert({
                                    term_order: 1,
                                    productId: created_row.id,
                                    termId: founded_term.id
                                }).then(() => {
                                    console.log(`create product's category was successful.`)
                                }).catch((err) => {
                                    console.log(`create product's category failed with err: ${err}`)
                                })
                            }).catch((err) => { console.log(`not found product meta ${err}`) })
                        })
                    }
                })
            }).catch((err) => {
                console.log(`create product failed with err: ${err}`)
            })
        })
        callback()
    },
    createProductVariations(product, variations, business_id, callback) {
        variations.map((variation) => {
            PRODUCT.upsert({
                reference_id: variation.id,
                title: product.title + ' - ' + variation.attributes[0].option,
                description: variation.description,
                slug: (variation.slug !== 'undefined') ? variation.slug : variation.sku,
                barcode: variation.sku,
                type: 'product_variation',
                status: variation.status,
                parent_id: product.id,
                business_id: business_id
            }).then((created_row) => {
                created_row = created_row[0]
                this.createProductMeta(variation, created_row.id, () => {
                    // do nothing
                })
            }).catch((err) => {
                console.log(`create product failed with err: ${err}`)
            })

        })
        callback()
    },
    createProductMeta(product, product_id, callback) {
        PRODUCT_META.bulkCreate([
            {
                meta_key: '_attributes',
                meta_value: syncHelpers.syncProductAttributes(product.type, product.attributes),
                productId: product_id
            },
            {
                meta_key: '_price',
                meta_value: product.price,
                productId: product_id
            },
            {
                meta_key: '_discount',
                meta_value: JSON.stringify({
                    "value":0,
                    "selected":"cash",
                    "options":[
                        {"text":"%","value":"percent"},
                        {"text":"هـ.ت","value":"cash"}
                    ]
                }),
                productId: product_id
            },
            {
                meta_key: '_stock',
                meta_value: JSON.stringify({
                    "value":(product.stock_quantity)?0:Number(product.stock_quantity),
                    "selected":"number",
                    "options":[
                        {"text":"∞","value":"infinity"},
                        {"text":"عـدد","value":"number"}
                    ]
                }),
                productId: product_id
            },
            {
                meta_key: '_dimensions',
                meta_value: JSON.stringify(product.dimensions),
                productId: product_id
            },
            {
                meta_key: '_weight',
                meta_value: product.weight,
                productId: product_id
            },
            {
                meta_key: '_online_sell',
                meta_value: 1,
                productId: product_id
            },
            {
                meta_key: '_online_price',
                meta_value: product.price,
                productId: product_id
            },
            {
                meta_key: '_online_discount',
                meta_value: null,
                productId: product_id
            },
            {
                meta_key: '_online_stock',
                meta_value: (product.stock_quantity)?0:Number(product.stock_quantity),
                productId: product_id
            },
            {
                meta_key: '_links',
                meta_value: JSON.stringify(product._links),
                productId: product_id
            },
            {
                meta_key: '_images',
                meta_value: JSON.stringify(product.images),
                productId: product_id
            }
        ],{
            updateOnDuplicate: ['meta_value']
        }).then(() => {
            console.log(`product meta imported.`)
            callback()
        }).catch((err) => {
            console.log(`create product meta failed with err: ${err}`)
        })
    },
    createOrders(orders, user_id, callback) {
        orders.map((order) => {
            if (order.status === 'completed') {
                ORDER.upsert({
                    reference_id: order.id,
                    order_key: order.order_key,
                    total_price: order.total,
                    type: 'type_1',
                    status: order.status,
                    userId: user_id
                },{
                    returning: true
                }).then((created_row) => {
                    created_row = created_row[0]
                    ORDER_META.bulkCreate([
                        {
                            meta_key: '_addition',
                            meta_value: 0,
                            orderId: created_row.id
                        },
                        {
                            meta_key: '_discount',
                            meta_value: Number(order.discount_total),
                            orderId: created_row.id
                        },
                        {
                            meta_key: '_shipping',
                            meta_value: Number(order.shipping_total),
                            orderId: created_row.id
                        },
                        {
                            meta_key: '_delivery',
                            meta_value: null,
                            orderId: created_row.id
                        }
                    ],{
                        updateOnDuplicate: ['meta_value']
                    }).then(() => {
                        console.log(`order meta imported.`)
                        if (order.line_items.length > 0) {
                            order.line_items.map(item => {
                                this.createOrderItems(created_row.id, item, () => {
                                    console.log(`order item is created.`)
                                })
                            })
                        }
                    }).catch((err) => {
                        console.log(`create order meta failed with err: ${err}`)
                    })
                }).catch((err) => {
                    console.log(`create order failed with err: ${err}`)
                })
            }
        })
        callback()
    },
    createOrderItems(order_id, item, callback) {
        PRODUCT.findOne({
            where: { reference_id: item.product_id }
        }).then((founded_product) => {
            ORDER_ITEM.upsert({
                price: item.price,
                count: item.quantity,
                discount: {type:"percent",amount:0},
                type: "type_1",
                status: "active",
                productId: founded_product.id,
                orderId: order_id
            }).then(() => {
                callback()
            }).catch((err) => {
                console.log(`function: createOrderItems, error: item not created with error: ${err}`)
            })
        }).catch((err) => { console.log(`function: createOrderItems, error: Product not found with error:${err}`) })
    }
}

const syncHelpers = {
    syncProductAttributes: (type, attributes) => {
        if (type === 'variable') {
            let attr = attributes[0]
            let response = {
                "name": attr.name,
                "value": attr.name,
                "position": 0,
                "visible": true,
                "variation": true,
                "options": attr.option
            }
            return JSON.stringify(response)
        }
        return null
    }
}

exports.getUserWebsiteData = async (req, res) => {
    const website = await user.getWebsiteData(req.body.id)
    if (website) {
        res.json(website)
    } else {
        throw new Error('Website not found!')
    }
}

exports.setUserWebsiteData = (req, res) => {
    USER_META.bulkCreate([
        {
            meta_key: '_address',
            meta_value: req.body._address,
            userId: req.userId
        },
        {
            meta_key: '_consumer_key',
            meta_value: req.body._consumer_key,
            userId: req.userId
        },
        {
            meta_key: '_consumer_secret',
            meta_value: req.body._consumer_secret,
            userId: req.userId
        },
        {
            meta_key: '_api_version',
            meta_value: 'wc/v3',
            userId: req.userId
        }
    ],{
        updateOnDuplicate: ['meta_value']
    }).then(upserted_rows => {
        console.log(upserted_rows)
    }).catch(err => console.log(err))
}

exports.syncCategories = async (req, res) => {
    const website = await user.getWebsiteData(req.userId)
    if (website) {
        const api = user.createWcApi(website)
        let page, total_page, api_result
        page = total_page = 0
        api_result = []
        do {
            await api.get("products/categories", { page: ++page, per_page: 100, orderby: 'id' })
                .then(response => {
                    total_page = Number(response.headers['x-wp-totalpages'])
                    response.data.map(async (term) => {
                        api_result.push(term)
                    })
                })
                .catch((err) => {
                    console.log("Response Status:", err.response.status)
                    console.log("Response Headers:", err.response.headers)
                    console.log("Response Data:", err.response.data)
                })
                .finally(() => {})
        } while (page < total_page)

        await user.createTerms(api_result, req.business, () => {
            res.status(200).json({ message: 'دسته بندی ها با موفقیت همگام سازی شده اند.'})
        })
    }
}

exports.syncProducts = async (req, res) => {
    const website = await user.getWebsiteData(req.userId)
    if (website) {
        const api = user.createWcApi(website)
        let page, total_page, api_result
        page = total_page = 0
        api_result = []
        do  {
            await api.get("products", { page: ++page, per_page: 100, orderby: 'id' }).then(response => {
                total_page = parseInt(response.headers['x-wp-totalpages'])
                response.data.map(async (product) => {
                    api_result.push(product)
                })
            }).catch((err) => {
                console.log("Response Status:", err.response.status)
                console.log("Response Headers:", err.response.headers)
                console.log("Response Data:", err.response.data)
            }).finally(() => {})
        } while (page < total_page)

        await user.createProducts(api_result, req.business, () => {
            res.status(200).json({ message: 'محصولات با موفقیت همگام سازی شده اند.'})
        })
    }
}

exports.syncProductVariations = async (req, res) => {
    const website = await user.getWebsiteData(req.userId)

    if (website) {
        const api = user.createWcApi(website)
        let variable_products = await PRODUCT.findAll({
            where: {
                type: 'variable'
            }
        })
        if (variable_products.length > 0) {
            variable_products.map(async (variable) => {
                let api_result = []
                let page = 0
                let total_page = 0
                do  {
                    await api.get("products/" + variable.reference_id + "/variations", { page: ++page, per_page: 100, orderby: 'id' })
                    .then(response => {
                        total_page = parseInt(response.headers['x-wp-totalpages'])
                        response.data.map(async (product) => {
                            api_result.push(product)
                        })
                    }).catch((err) => {
                        console.log("Response Status:", err.response.status)
                        console.log("Response Headers:", err.response.headers)
                        console.log("Response Data:", err.response.data)
                    }).finally(() => {})
                } while (page < total_page)

                await user.createProductVariations(variable, api_result, req.business, () => {
                    res.status(200).json({ message: 'محصولات متغیر با موفقیت همگام سازی شده اند.'})
                })
            })
        }
    }
}

exports.syncOrders = async (req, res) => {
    const website = await user.getWebsiteData(req.userId)
    if (website) {
        const api = user.createWcApi(website)
        let page, total_page, api_result
        page = total_page = 0
        api_result = []
        do  {
            await api.get("orders", { page: ++page, per_page: 100, orderby: 'id' }).then(response => {
                total_page = parseInt(response.headers['x-wp-totalpages'])
                response.data.map(async (order) => {
                    api_result.push(order)
                })
            }).catch((err) => {
                console.log("Response Status:", err.response.status)
                console.log("Response Headers:", err.response.headers)
                console.log("Response Data:", err.response.data)
            }).finally(() => {})
        } while (page < total_page)
        await user.createOrders(api_result, req.userId, () => {
            res.status(200).json({ message: 'سفارشات با موفقیت همگام سازی شده اند.'})
        })
    }
}

exports.userBoard = (req, res) => {
    res.status(200).send("User Content.")
}

exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content")
}

exports.syncVariableProducts = (req, res) => {

}