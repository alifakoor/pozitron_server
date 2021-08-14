/**
 * Requirements
 */
const DB = require("../models")
const WC_API = require('../config/wc.config')
const WINSTON = require('winston')
const _ = require('lodash')

/**
 * Models
 */
const OP = DB.Sequelize.Op
const PRODUCT = DB.product
const PRODUCT_META = DB.productmeta
const ORDER = DB.order
const ORDER_META = DB.ordermeta
const ORDER_ITEMS = DB.orderItems
const OrderItemMeta = DB.orderItemmeta
const CUSTOMER = DB.customer
const CUSTOMER_META = DB.customermeta

/**
 * configurations
 */
WINSTON.configure({
    transports: [
        new (WINSTON.transports.File)({ filename: 'app/logs/somefile.log' })
    ]
})

/**
 * getPureMetaData Function: get specially metadata
 * @param metadata: all metadata
 * @param key: specially key
 * @returns {{ meta_key: meta_value }}
 */
const getPureMetadata = function (metadata, key = []) {
    const result = {}
    for (let i = 0; i < metadata.length; i++) {
        if (key.includes(metadata[i].meta_key)) {
            result[metadata[i].meta_key] = metadata[i].meta_value
        }
    }
    return result
}

let createOrder = function () {

}

exports.orders = (req, res) => {

}

exports.saveCart = (req, res) => {
    ORDER.create({
        order_key: `_onp_${req.userId}`,
        total_price: req.body.totalPrice,
        type: 'type_1',
        status: 'on-hold',
        userId: req.userId
    }).then((order) => {
        ORDER_META.bulkCreate([
            {
                meta_key: '_onp_customer_name',
                meta_value: req.body.customer.name,
                orderId: order.dataValues.id
            },
            {
                meta_key: '_onp_customer_phone',
                meta_value: req.body.customer.phone,
                orderId: order.dataValues.id
            },
            {
                meta_key: '_onp_customer_address',
                meta_value: req.body.customer.address,
                orderId: order.dataValues.id
            }
        ]).then((ordermeta) => {
            req.body.items.forEach((item) => {
                PRODUCT_META.findAll({
                    where: {
                        productId: item.id,
                        meta_key: {
                            [OP.or]: ['_wc_stock_quantity', '_wc_id', '_wc_price']
                        }
                    }
                }).then((product) => {
                    let pureData = getPureMetadata(product, ['_wc_stock_quantity', '_wc_id', '_wc_price'])
                    let stock = parseInt(pureData._wc_stock_quantity)
                    let wc_price = parseInt(pureData._wc_price)
                    let wc_id = parseInt(pureData._wc_id)
                    WC_API.put("products/"+wc_id, {
                        stock_quantity: stock - item.count
                    }).then(() => {
                        PRODUCT_META.update({
                            meta_value: (stock - item.count).toString()
                        },{
                            where: {
                                productId: item.id,
                                meta_key: '_wc_stock_quantity'
                            }
                        }).then((productmeta) => {
                            ORDER_ITEMS.create({
                                price: wc_price,
                                count: item.count,
                                type: 'type_1',
                                status: 'active',
                                orderId: order.dataValues.id,
                                productId: item.id
                            }).then((orderitem) => {
                                // console.log(orderitem)
                                // create meta for order items
                                console.log(order)
                                res.status(200).send({
                                    message: 'سفارش به درستی ذخیره شد.'
                                })
                            }).catch((err) => {
                                console.log(`create order item failed with error: ${err}`)
                            })
                        }).catch((err) => {
                            console.log(`update product's stock failed with error: ${err}`)
                        })
                    }).catch((err) => {
                        console.log(`update wc stock failed with error: ${err}`)
                    })
                }).catch((err) => {
                    console.log(`not find product with error: ${err}`)
                })
            })
        }).catch((err) => {
            console.log(`create ordermeta failed with error: ${err}`)
        })
    }).catch((err) => {
        console.log(`create order failed with error: ${err}`)
    })
}

exports.getPreviousOrders = (req, res) => {
    ORDER.findAll({
        include: [{
            model: ORDER_META
        },{
            model: PRODUCT,
            as: 'items',
            include: [ { model: PRODUCT_META } ]
        },{
            model: CUSTOMER,
            include: [{
                model: CUSTOMER_META
            }]
        }],
        where: {
            userId: req.userId,
            status: 'on-hold'
        }
    }).then(orders => {
        orders.forEach(order => {
            order.dataValues.order_meta = _.chain(order.order_meta).keyBy('meta_key').mapValues('meta_value').value()
            order.dataValues.customer.dataValues.customer_meta = _.chain(order.customer.customer_meta).keyBy('meta_key').mapValues('meta_value').value()
            order.items.forEach(item => {
                item.dataValues.product_meta = _.chain(item.product_meta).keyBy('meta_key').mapValues('meta_value').value()
            })
        })
        res.status(200).send(orders)
    }).catch((err) => { WINSTON.log('error', `Previous Orders not Found: ${err}`) })
}

exports.completeCart = (req, res) => {
    ORDER.update({
        status: 'completed'
    },{
        where: {
            id: req.body.order_id
        }
    }).then(() => {
        res.status(200).send({
            message: 'آپدیت با موفقیت انجام شد.'
        })
    }).catch((err) => { console.log(`update order failed with error: ${err}`) })
}

exports.getCustomer = async (req, res) => {
    await CUSTOMER.findOrCreate({
        where: {
            phone: req.body.phone
        },
        defaults: {
            userId: req.body.userId
        },
        include: [
            {
                model: CUSTOMER_META,
                as: 'customer_meta'
            }
        ]
    }).then(created_customer => {
        let customer = created_customer[0]
        if (customer._options.isNewRecord) {
            CUSTOMER_META.bulkCreate([
                {
                    meta_key: '_email',
                    meta_value: null,
                    customerId: customer.dataValues.id
                },
                {
                    meta_key: '_address',
                    meta_value: null,
                    customerId: customer.dataValues.id
                },
                {
                    meta_key: '_description',
                    meta_value: null,
                    customerId: customer.dataValues.id
                }
            ]).then(created_customermeta => {
                customer.dataValues.customer_meta = {}
                created_customermeta.forEach(meta => {
                    customer.dataValues.customer_meta[meta.getDataValue('meta_key')] = meta.getDataValue('meta_value')
                })
                return customer
            }).then(customer => {
                res.status(200).send({
                    success: true,
                    isNewCustomer: true,
                    customer
                })
            }).catch(err => { WINSTON.log('error', `Customer Meta Not Created: ${err}`) })
        } else {
            let customermeta = customer.dataValues.customer_meta
            customer.dataValues.customer_meta = {}
            customermeta.forEach(meta => {
                customer.dataValues.customer_meta[meta.getDataValue('meta_key')] = meta.getDataValue('meta_value')
            })
            res.status(200).send({
                success: true,
                isNewCustomer: false,
                customer
            })
        }
    }).catch(err => { WINSTON.log('error', `Customer Not Found: ${err}`) })
}

exports.createOrder = async (req, res) => {
    CUSTOMER.update({
        fullname: req.body.fullname,
        phone: req.body.phone
    },{
        where: {
            id: req.body.id
        }
    }).then(updated_customer => {
        CUSTOMER_META.bulkCreate([
            {
                meta_key: '_email',
                meta_value: req.body.customer_meta._email,
                customerId: req.body.id
            },
            {
                meta_key: '_address',
                meta_value: req.body.customer_meta._address,
                customerId: req.body.id
            },
            {
                meta_key: '_description',
                meta_value: req.body.customer_meta._description,
                customerId: req.body.id
            }
        ],{
            updateOnDuplicate: ['meta_value']
        }).then().catch(err => { WINSTON.log('error', `Customer Meta Not Updated: ${err}`) })
    }).then(() => {
        ORDER.create({
            order_key: '_zi_' + req.body.id + '_' + req.body.userId,
            total_price: 0,
            type: 'type_1',
            status: 'on-hold',
            userId: req.body.userId,
            customerId: req.body.id
        }).then(created_order => {
            ORDER_META.bulkCreate([
                {
                    meta_key: '_addition',
                    meta_value: 0,
                    orderId: created_order.dataValues.id
                },
                {
                    meta_key: '_discount',
                    meta_value: 0,
                    orderId: created_order.dataValues.id
                },
                {
                    meta_key: '_shipping',
                    meta_value: 0,
                    orderId: created_order.dataValues.id
                },
                {
                    meta_key: '_delivery',
                    meta_value: null,
                    orderId: created_order.dataValues.id
                }
            ]).then(created_ordermeta => {
                created_order.dataValues.order_meta = {}
                created_ordermeta.forEach(meta => {
                    created_order.dataValues.order_meta[meta.getDataValue('meta_key')] = meta.getDataValue('meta_value')
                })
                res.status(200).send({
                    success: true,
                    order: created_order
                })
            }).catch(err => { WINSTON.log('error', `Order Meta Not Created: ${err}`) })
        }).catch(err => { WINSTON.log('error', `Order Not Created: ${err}`) })
    }).catch(err => { WINSTON.log('error', `Customer Not Updated: ${err}`) })
}

exports.deleteOrder = async (req, res) => {
    const destroyOrder = await ORDER.destroy({
        where: {
            id: req.body.id
        }
    })
    if (destroyOrder) {
        res.status(200).send({
            success: true,
            message: 'سفارش حذف شد.'
        })
    } else {
        res.status(200).send({
            success: false,
            message: 'سفارش حذف نشد، دوباره تلاش کنید.'
        })
    }
}

exports.deleteItemFromOrder = async (req, res) => {
    await ORDER_ITEMS.destroy({
        where: {
            id: req.body.id
        }
    }).then(destroyedItem => {
        if (destroyedItem) {
            res.status(200).send({
                success: true,
                message: `Order's Items Deleted!`
            })
        }
    }).catch(err => console.log(err))
}

exports.saveOrder = async (req, res) => {
    req.body.items.forEach(async (item) => {
        const orderItem = await ORDER_ITEMS.create({
            price: item.price,
            count: item.stock,
            discount: JSON.stringify(item.discount),
            type: 'type_1',
            status: 'active',
            productId: item.id,
            orderId: req.body.details.id
        })
        if (!orderItem) {
            console.log('create order item failed')
        }
    })
    const updatedOrder = await ORDER.update({
        total_price: req.body.details.total_price
    },{
        where: {
            id: req.body.details.id
        }
    })
    if (updatedOrder) {
        if (req.body.meta.addition) {
            await ORDER_META.create({
                meta_key: '_addition',
                meta_value: req.body.meta.addition,
                orderId: req.body.details.id
            })
        }
        if (req.body.meta.discount) {
            await ORDER_META.create({
                meta_key: '_discount',
                meta_value: req.body.meta.discount,
                orderId: req.body.details.id
            })
        }
        if (req.body.meta.shipping) {
            await ORDER_META.create({
                meta_key: '_shipping',
                meta_value: req.body.meta.shipping,
                orderId: req.body.details.id
            })
        }
        res.status(200).send({
            success: true,
            message: 'سفارش دخیره شد.'
        })
    }
}

exports.saveCurrentOrder = async (req, res) => {
    ORDER_ITEMS.bulkCreate(req.body.items, {
        updateOnDuplicate: ['price', 'count', 'type', 'status', 'discount']
    }).then(updated_order => {
        ORDER.findOne({
            include: [
            {
                model: PRODUCT,
                as: 'items',
                include: [ { model: PRODUCT_META } ]
            }],
            where: {
                id: req.body.details.id
            }
        }).then(founded_order => {
            founded_order.update({
                total_price: req.body.details.total_price
            })
            founded_order.items.forEach(item => {
                item.dataValues.product_meta = _.chain(item.product_meta).keyBy('meta_key').mapValues('meta_value').value()
            })
            res.status(200).send({
                success: true,
                order: founded_order
            })
        }).catch(err => { console.log(`order was not found, error: ${err}`) })
    }).catch(err => { console.log(`order was not updated, error: ${err}`) })
}

exports.payOrder = async (req, res) => {
    const order = await ORDER.update(
        {
            status: 'completed'
        },
        {
            where: {
                id: req.body.details.id
            }
        }
    )
    if (order) {
        if (req.body.order_meta._delivery) {
            await ORDER_META.create({
                meta_key: '_delivery',
                meta_value: req.body.order_meta._delivery,
                orderId: req.body.details.id
            })
        }
        res.status(200).send({
            success: true,
            message: 'سفارش تکمیل شد.'
        })
    } else {
        res.status(400).send({
            success: false,
            message: 'خطایی رخ داده است، دوباره تلاش کنید.'
        })
    }

}
