'use strict'

// database instance
const db = require('../db')

// woocommerce helper
const WcHelpers = require('../helpers/wc.helpers')

// functions
function getAll(req, res) {
    db.business
        .findOne({
            where: {
                userId: req.user.id
            }
        })
        .then(business => {
            if (business) {
                db.product
                    .findAll({
                        where: {
                            type: {
                                [db.Op.in]: ['simple', 'variation']
                            },
                            businessId: business.id
                        },
                        include: [
                            {
                                model: db.productmeta,
                                as: 'meta'
                            },
                            {
                                model: db.productImage,
                                as: 'images',
                                required: false
                            }
                        ]
                    })
                    .then(products => {
                        if (products.length) {
                            res.status(200).json({
                                success: true,
                                message: 'The list of products found successfully.',
                                data: products
                            })
                        } else {
                            res.status(200).json({
                                success: false,
                                message: 'There is not any products.'
                            })
                        }

                    })
                    .catch(err => {
                        console.log(err)
                        res.status(400).send({ success: false, message: 'something wrong is happened in list of products.' })
                    })
            } else {
                res.status(200).send({ success: false, message: 'user business not found.' })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).send({ success: false, message: 'user business not found.' })
        })
}
async function edit(req, res) {
    const { price, salePrice, stock, onlinePrice, onlineSalePrice, onlineStock, onlineSell } = req.body.fields
    const business = await db.business.findOne({where: {userId: req.user.id}})
    const wc = new WcHelpers(`https://${business.domain}`, business.key, business.secret)

    let done = true
    for (const id of req.body.ids) {
        const product = await db.product.findByPk(id)
        if (!product) continue
        await product.update({
            price,
            salePrice,
            stock,
            onlinePrice,
            onlineSalePrice,
            onlineStock,
            onlineSell,
            infiniteStock: !stock
        })
        if (product.type === 'simple') {
            const updated = await wc.updateProduct({
                id: product.ref,
                onlinePrice: product.onlinePrice,
                onlineSalePrice: product.onlineSalePrice,
                onlineStock: product.onlineStock
            })
            if (!updated) {
                done = false
                break
            }
        }
        if (product.type === 'variation') {
            const parent = await db.product.findByPk(product.parentId)
            const updated = await wc.updateProductVariation({
                id: product.ref,
                parentId: parent.ref,
                onlinePrice: product.onlinePrice,
                onlineSalePrice: product.onlineSalePrice,
                onlineStock: product.onlineStock
            })
            if (!updated) {
                done = false
                break
            }
        }
    }

    if (done) {
        return res.json({
            success: true,
            message: 'The products have been updated successfully.'
        })
    }
    return res.json({
        success: false,
        message: 'The products have NOT been updated successfully.'
    })
}
async function remove(req, res) {
    const business = await db.business.findOne({where: {userId: req.user.id}})
    const wc = new WcHelpers(`https://${business.domain}`, business.key, business.secret)
    let done = true

    for (const id of req.body.ids) {
        const product = await db.product.findByPk(id)
        if (!product) continue
        if (product.type === 'simple') {
            const updated = await wc.deleteProduct(product.ref)
            if (!updated) {
                done = false
                break
            }
        }
        if (product.type === 'variation') {
            const parent = await db.product.findByPk(product.parentId)
            const updated = await wc.deleteProductVariation(product.ref, parent.ref)
            if (!updated) {
                done = false
                break
            }
        }
        product.destroy()
    }

    if (done) {
        return res.json({
            success: true,
            message: 'The products have been deleted successfully.'
        })
    }
    return res.json({
        success: false,
        message: 'The products have NOT been deleted successfully.'
    })
}

// export controller
module.exports = {
    getAll,
    edit,
    remove
}