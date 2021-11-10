const db = require("../models")
const Product = db.product
const ProductMeta = db.productmeta
const Order = db.order
const OrderMeta = db.ordermeta
const OrderItems = db.orderItems
const OrderItemMeta = db.orderItemmeta
const Customer = db.customer
const CustomerMeta = db.customermeta
const User = db.user

const Op = db.Sequelize.Op

const _ = require('lodash')

exports.invoices = (req, res) => {
    Order.findAll({
        include: [{
            model: Customer
        },{
            model: OrderMeta
        },{
            model: User
        },{
            model: Product,
            as: 'items',
            include: [
                {
                    model: ProductMeta
                }
            ]
        }]
    }).then((invoices) => {
        invoices.map(invoice => {
            invoice.dataValues.order_meta = _.chain(invoice.order_meta).keyBy('meta_key').mapValues('meta_value').value()
        })
        User.findAll().then((users) => {
            res.status(200).send({
                success: true,
                invoices: invoices,
                users: users
            })
        })
    }).catch((err) => {
        console.log(`find all invoices faild with error: ${err}`)
    })
}
