const middleware = require('../../middlewares/auth.middlewares')
const controller = require('../../controllers/business.controllers')

module.exports = (app, prefix) => {
    app.get(`${prefix}/business/check/:domain`, middleware.verifyToken, controller.check)
    app.post(`${prefix}/business/create`, middleware.verifyToken, controller.create)
}