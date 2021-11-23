/**
 * Requirements
 */
const DB = require("../models")
const WINSTON = require('winston')
const _ = require('lodash')

/**
 * Models
 */
const Op = DB.Sequelize.Op
const Product = DB.product
const ProductMeta = DB.productmeta
const Term = DB.term
const TermMeta = DB.termmeta
const TermRelation = DB.termRelation
const Order = DB.order
const OrderMeta = DB.ordermeta
const OrderItems = DB.orderItems
const OrderItemMeta = DB.orderItemmeta
const Customer = DB.customer
const CustomerMeta = DB.customermeta

/**
 * configurations
 */
WINSTON.configure({
    transports: [
        new (WINSTON.transports.File)({ filename: 'app/logs/somefile.log' })
    ]
})

module.exports = (io) => {
    const getPreviousOrders = function (data, callback) {
        console.log('ioooooooooooo')
        console.log(data)
        return 'from server'
        // socket.emit("public", {data: 'from server'})
        // callback({
        //     status: true,
        //     data: 'from server'
        // })
        // Order.findAll({
        //     include: [{
        //         model: OrderMeta
        //     },{
        //         model: Product,
        //         as: 'items',
        //         include: [ { model: ProductMeta } ]
        //     },{
        //         model: Customer,
        //         include: [{
        //             model: CustomerMeta
        //         }]
        //     }],
        //     where: {
        //         userId: req.userId,
        //         status: 'در حال تکمیل'
        //     }
        // }).then(orders => {
        //     orders.forEach(order => {
        //         order.dataValues.order_meta = _.chain(order.order_meta).keyBy('meta_key').mapValues('meta_value').value()
        //         order.dataValues.customer.dataValues.customer_meta = _.chain(order.customer.customer_meta).keyBy('meta_key').mapValues('meta_value').value()
        //         order.items.forEach(item => {
        //             item.dataValues.product_meta = _.chain(item.product_meta).keyBy('meta_key').mapValues('meta_value').value()
        //         })
        //     })
        //     res.status(200).send(orders)
        // }).catch((err) => { WINSTON.log('error', `Previous Orders not Found: ${err}`) })
    }
    const getAllProductsForCart = async function (callback) {
        return await ProductMeta.findAll({
            where: {
                meta_key: '_stock',
                [Op.or] : [
                    { meta_value: { [Op.like]: '%"selected":"infinity"%' }},
                    { meta_value: { [Op.notLike]: '%"value":0%' }}
                ]
            }
        }).then(founded_meta => {
            // founded_meta = founded_meta.filter(f => {
            //     if (f.dataValues.meta_key === '_price') {
            //         if (f.dataValues.meta_value !== '0') {
            //             console.log(f.dataValues.productId)
            //             return f.dataValues.productId
            //         }
            //     } else {
            //         return f.dataValues.productId
            //     }
            // })
            let products_ids = []
            founded_meta.forEach((meta) => {
                products_ids.push(meta.dataValues.productId)
            })
            return Product.findAll({
                where: {
                   id: { [Op.in]: products_ids }
                },
                include: [{ model: ProductMeta }, { model: Term }]
            }).then(products => {
                products.forEach(product => {
                    product.dataValues.product_meta = _.chain(product.product_meta).keyBy('meta_key').mapValues('meta_value').value()
                })
                return products
            }).catch((err) => {
                console.log(`all products not found with err: ${err}`)
                return false
            })
        }).catch(err => console.log(err))
    }
    const updateProductStock = async function (data, callback) {
        return await ProductMeta.update({
            meta_value: JSON.stringify(data.stock)
        },{
            where: {
                meta_key: '_stock',
                productId: data.id
            }
        }).then(() => {
            return true
        }).catch(() => { return false })
    }
    const saveCurrentOrder = async function () {}
    return {
        getPreviousOrders,
        getAllProductsForCart,
        updateProductStock,
        saveCurrentOrder
    }
}
