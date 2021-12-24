// middlewares
const { verifyToken, verifyWebhook } = require('../../middlewares/auth.middlewares')

// controller
const controller = require('../../controllers/orders.controllers')

// export apis
module.exports = (app, prefix) => {
	app.post(`${prefix}/orders/webhooks/create/:businessId/:businessKey`, [ verifyWebhook ], controller.createdWithWebhook)
	app.post(`${prefix}/orders/webhooks/update/:businessId/:businessKey`, [ verifyWebhook ], controller.updatedWithWebhook)
	app.post(`${prefix}/orders/webhooks/delete/:businessId/:businessKey`, [ verifyWebhook ], controller.deletedWithWebhook)
}