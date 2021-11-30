// const { checkDuplicatedPhone } = require('../middlewares')
const controller = require('../controllers/user.controllers')
const router = require('express').Router()

router.post("/signup", controller.signup)
router.post("/signin", controller.signin)

module.exports = router