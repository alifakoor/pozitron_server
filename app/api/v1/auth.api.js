const controller = require('../../controllers/user.controllers')
const middleware = require('../../middlewares/auth.middlewares')

module.exports = (app, prefix) => {
    app.post(`${prefix}/auth`, middleware.checkPhone, controller.loginOrRegister)
    app.post(`${prefix}/auth/verify`, [middleware.checkPhone, middleware.checkCode], controller.verifyCode)
}