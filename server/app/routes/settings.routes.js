const { authJWT, authorization } = require("../middlewares")
const controller = require("../controllers/user.controllers.js")

module.exports = function(app) {
	app.use(function(req, res, next) {
		res.header(
		  "Access-Control-Allow-Headers",
		  "x-access-token, Origin, Content-Type, Accept"
		)
		next()
	})

	app.post("/api/settings/sync_variable_products", [ authJWT.verifyToken ], controller.syncVariableProducts)
	app.post("/api/settings/get_user_website", [ authJWT.verifyToken ], controller.getUserWebsiteData)
	app.post("/api/settings/set_user_website", [ authJWT.verifyToken ], controller.setUserWebsiteData)
	app.post("/api/settings/sync_categories", [ authJWT.verifyToken, authorization.checkUserBusinessByUserId ], controller.syncCategories)
	app.post("/api/settings/sync_products", [ authJWT.verifyToken, authorization.checkUserBusinessByUserId ], controller.syncProducts)
	app.post("/api/settings/sync_product_variations", [ authJWT.verifyToken, authorization.checkUserBusinessByUserId ], controller.syncProductVariations)
	app.post("/api/settings/sync_orders", [ authJWT.verifyToken, authorization.checkUserBusinessByUserId ], controller.syncOrders)
}