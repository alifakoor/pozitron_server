'use strict'

function checkInputsBeforeCreate(req, res, next) {
	const helper = checkInputsBeforeCreateHelper(req.body);
	if (helper.hasErr) {
		return res.json({ success: false, message: helper.errMessages });
	}
	next();
}
function checkInputsBeforeCreateHelper(inputs) {
	let hasErr = false
	let errMessages = []
	const {
		item
	} = inputs
	if (!item || typeof item !== 'number') {
		hasErr = true
		errMessages.push('The item field is required.')
	}

	return { hasErr, errMessages }
}

module.exports = {
	checkInputsBeforeCreate
}