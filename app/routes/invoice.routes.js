const { authJWT } = require("../middlewares")
const controller = require("../controllers/invoice.controllers.js")

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        )
        next()
    })

    app.get(
        "/api/invoices/all",
        [
            authJWT.verifyToken
        ],
        controller.invoices
    )

}