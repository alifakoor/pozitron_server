// middlewares
const { verifyToken } = require('../../middlewares/auth.middlewares')

// controller
const controller = require('../../controllers/product.controllers')

// export apis
module.exports = (app, prefix) => {
    app.get(`${prefix}/products`, verifyToken, controller.getAll)
}