'use strict'

// database instance
const db = require('../db')

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
function edit(req, res) {
    db.product
        .update(req.body.fields, {
            where: {
                id: req.body.ids
            }
        })
        .then(rows => {
            let [count] = rows
            if (!count) {
                return res.json({
                    success: false,
                    message: 'No Product has been updated, please check your ids list.'
                })
            }
            return res.json({
                success: true,
                message: 'Products have been updated successfully.'
            })
        })
        .catch(err => {
            console.log(err)
            res.json({
                success: false,
                message: 'Products have NOT been updated successfully.'
            })
        })
}

// export controller
module.exports = {
    getAll,
    edit
}