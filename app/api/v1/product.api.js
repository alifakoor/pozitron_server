// middlewares
const { verifyToken, verifyWebhook } = require('../../middlewares/auth.middlewares')
const { checkBulkEditReq, checkBulkRemoveReq } = require('../../middlewares/product.middlewares')

// controller
const controller = require('../../controllers/product.controllers')

// export apis
module.exports = (app, prefix) => {
    app.get(`${prefix}/products`, verifyToken, controller.getAll)
    app.put(`${prefix}/products/edit`, [ verifyToken, checkBulkEditReq ], controller.edit)
    app.post(`${prefix}/products/remove`, [ verifyToken, checkBulkRemoveReq ], controller.remove)
    app.post(`${prefix}/products/webhooks/create/:businessId/:businessKey`, [ verifyWebhook ], controller.createdWithWebhook)
    app.post(`${prefix}/products/webhooks/update/:businessId/:businessKey`, [ verifyWebhook ], controller.updatedWithWebhook)
    app.post(`${prefix}/products/webhooks/delete/:businessId/:businessKey`, [ verifyWebhook ], controller.deletedWithWebhook)
}