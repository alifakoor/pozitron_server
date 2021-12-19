// middlewares
const { verifyToken, checkDomainAndKeys } = require('../../middlewares/auth.middlewares')

// controller
const controller = require('../../controllers/business.controllers')

// export apis
module.exports = (app, prefix) => {
    app.post(`${prefix}/business/check`, verifyToken, controller.check)
    app.post(`${prefix}/business/create`, [verifyToken, checkDomainAndKeys], controller.create)
}