const { Router } = require('express');
const router = Router();

// middleware
const { verifyToken, checkAdminLogin } = require('../middlewares/auth.middlewares');
const { isAdmin } = require('../middlewares/authz.middlewares');

// controller
const { loginPage, login, panelPage } = require('../controllers/admin.controllers');

router.route('')
	.get(loginPage)
	.post(checkAdminLogin, login)

router.get('/panel', verifyToken, isAdmin, panelPage);

module.exports = router;