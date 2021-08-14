const { authentication } = require("../middlewares")
const controller = require("../controllers/auth.controllers.js")

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        )
        next()
    })

    app.post("/api/auth/signup", [authentication.checkDuplicateUsernameOrPhone, authentication.checkBusinessExist], controller.signup)
    app.post("/api/auth/signin", [authentication.checkBusinessExist, authentication.checkUserBusiness], controller.signin)
}