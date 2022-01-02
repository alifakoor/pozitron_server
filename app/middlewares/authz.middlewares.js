'use strict'

// db
const db = require('../db');

function isAdmin(req, res, next) {
	if(!req.user.role || req.user.role !== 'admin') {
		return res.status(403).send({ success: false, message: 'Unauthorized' });
	}
	next()
}

module.exports = {
	isAdmin
}