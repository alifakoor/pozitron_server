'use strict'

const { Router } = require('express');
const router = Router();

const { checkPhone, checkCode } = require('../../middlewares/auth.middlewares');
const { loginOrRegister, verifyCode } = require('../../controllers/user.controllers');
const shortHash = require('short-hash');


router.post('', checkPhone, loginOrRegister);
router.post('/verify', [ checkPhone, checkCode ], verifyCode );
// new
module.exports = router;