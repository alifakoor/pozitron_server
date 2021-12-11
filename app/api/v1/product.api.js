// middlewares
const { verifyToken } = require('../../middlewares/auth.middlewares')
const { checkBulkEditReq } = require('../../middlewares/product.middlewares')

// controller
const controller = require('../../controllers/product.controllers')

// export apis
module.exports = (app, prefix) => {
    app.get(`${prefix}/products`, verifyToken, controller.getAll)
    app.put(`${prefix}/products/edit`, [ verifyToken, checkBulkEditReq ], controller.edit)
}