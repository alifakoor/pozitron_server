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
// module.exports = (app) => {
// 	app.use((req, res, next) => {
// 		res.header(
// 			"Access-Control-Allow-Headers",
// 			"zi-access-token, Origin, Content-Type, Accept"
// 		);
// 		next();
// 	});
//
// 	// base route
// 	app.get('/', (req, res) => { res.send('This is the Pozitron.') });
// }