const { authJWT, authorization } = require("../middlewares")
const { uploadFiles } = require("../middlewares")
const controller = require("../controllers/product.controllers.js")

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        )
        next()
    })

    app.post("/api/products/all", [authJWT.verifyToken], controller.products)
    app.post("/api/products/sync", [authJWT.verifyToken], controller.syncProducts)
    app.post("/api/products/cart", [authJWT.verifyToken], controller.getAllProductsForCart)
    app.post("/api/products/manage_stock", [authJWT.verifyToken], controller.manageStock)
    app.post("/api/products/create_new_product", [authJWT.verifyToken, authorization.checkUserBusinessByUserId], controller.createNewProduct)
    app.post("/api/products/delete_product", [authJWT.verifyToken], controller.deleteProduct)
    app.post("/api/products/delete_product_variation", [authJWT.verifyToken], controller.deleteProductVariation)
    app.post("/api/products/manage_online_sell", [authJWT.verifyToken], controller.manageOnlineSell)
    app.post("/api/products/get_one_product", [authJWT.verifyToken], controller.getOneProduct)
}