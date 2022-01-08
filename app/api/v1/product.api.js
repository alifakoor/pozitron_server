// middlewares
const { verifyToken, verifyWebhook } = require('../../middlewares/auth.middlewares')
const { checkBulkEditReq, checkBulkRemoveReq, checkInputsBeforeCreate } = require('../../middlewares/product.middlewares')

// controller
const controller = require('../../controllers/product.controllers')

// export apis
module.exports = (app, prefix) => {
    app.get(`${prefix}/products`, controller.getAll)
    app.post(`${prefix}/products/create`, [ checkInputsBeforeCreate ], controller.create)
    app.put(`${prefix}/products/edit`, [ checkBulkEditReq ], controller.edit)
    app.post(`${prefix}/products/remove`, [ checkBulkRemoveReq ], controller.remove)
    app.post(`${prefix}/products/webhooks/create/:businessId/:businessKey`, [ verifyWebhook ], controller.createdWithWebhook)
    app.post(`${prefix}/products/webhooks/update/:businessId/:businessKey`, [ verifyWebhook ], controller.updatedWithWebhook)
    app.post(`${prefix}/products/webhooks/delete/:businessId/:businessKey`, [ verifyWebhook ], controller.deletedWithWebhook)
}