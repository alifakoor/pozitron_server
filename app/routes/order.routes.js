const { authJWT, authorization } = require("../middlewares")
const controller = require("../controllers/orders.controllers.js")

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        )
        next()
    })

    app.post("/api/orders/all", [authJWT.verifyToken], controller.orders)
    app.post("/api/orders/save_cart", [authJWT.verifyToken], controller.saveCart)
    app.post("/api/orders/save_current_order", [authJWT.verifyToken], controller.saveCurrentOrder)
    app.post("/api/orders/complete_cart", [authJWT.verifyToken], controller.completeCart)
    app.get("/api/orders/previous_orders", [authJWT.verifyToken], controller.getPreviousOrders)
    app.post("/api/orders/get_customer", [authJWT.verifyToken], controller.getCustomer)
    app.post("/api/orders/create", [authJWT.verifyToken, authorization.checkUserBusinessByUserId], controller.createOrder)
    app.post("/api/orders/delete", [authJWT.verifyToken], controller.deleteOrder)
    app.post("/api/orders/delete_item_from_order", [authJWT.verifyToken], controller.deleteItemFromOrder)
    app.post("/api/orders/save", [authJWT.verifyToken], controller.saveOrder)
    app.post("/api/orders/pay", [authJWT.verifyToken], controller.payOrder)
}