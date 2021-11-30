const { authJWT } = require("../middlewares")
const controller = require("../controllers/users.controllers.js")

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        )
        next()
    })

    app.get(
        "/api/test/user",
        [
            authJWT.verifyToken
        ],
        controller.userBoard
    )

    app.get(
        "/api/test/admin",
        [
            authJWT.verifyToken, authJWT.isAdmin
        ],
        controller.adminBoard
    )
}