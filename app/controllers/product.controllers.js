'use strict'

// database instance
const db = require('../db')

// functions
function getAll(req, res) {
    db.product
        .findAll({
            where: {
                type: {
                    [db.Op.in]: ['simple', 'variable']
                },
                businessId: req.businessId
            },
            include: [
                {
                    model: db.product,
                    as: 'variations',
                    include: [{ model: db.productmeta, as: 'meta' }]
                },
                {
                    model: db.productmeta,
                    as: 'meta'
                },
                {
                    model: db.productImage,
                    as: 'images',
                    required: false
                }
            ],
            order: [
                [
                    { model: db.product, as: 'variations' },
                    'id',
                    'ASC'
                ]
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
}

// export controller
module.exports = {
    getAll
}