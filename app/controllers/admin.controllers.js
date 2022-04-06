'use strict'

// dependencies
const jwt = require('jsonwebtoken')

// database instance
const db = require('../db/conn');

// functions
function loginPage(req, res) {
	res.render('admin/login', { page: 'login' });
}
async function login(req, res) {
	if(req.body.username !== 'pozitron_admin' || req.body.password !== 'AEG2jWf2c3ZfCY8c') {
		return res.status(406).send({ success: false, message: 'The username or password is not correct.' });
	}

	const user = {
		username: 'pozitron_admin',
		password: 'AEG2jWf2c3ZfCY8c',
		role: 'admin'
	};

	let token = jwt.sign({ user }, 'SECRET_KEY', { expiresIn: 86400 });

	return res.status(200).send({ success: true, message: 'Login successfully.', token })
}
async function panelPage(req, res) {
	try{
		const users = await db.user.findAll({
			include: {
				model: db.business
			}
		});
		res.render('admin/panel', { page: 'panel', users });
	} catch(err) {
		console.log(err);
		res.status(500).send({ success: false, message: 'Internal Server Error.' });
	}
}

// export controller
module.exports = {
	loginPage,
	login,
	panelPage
}