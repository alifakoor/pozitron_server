'use strict'

function checkBulkEditReq(req, res, next) {
	if (!Array.isArray(req.body.ids) || !req.body.ids?.length) {
		return res.status(200).json({ success: false, message: 'The list of ids is not correct' })
	}
	if (!req.body.fields) {
		return res.status(200).json({ success: false, message: 'You did not set fields.' })
	}
	let propHasErr = null
	for (const prop in req.body.fields) {
		if (!req.body.fields.hasOwnProperty(prop)) {
			propHasErr = prop
			break
		}
		if (prop === 'onlineSell') {
			if (typeof req.body.fields[prop] !== 'boolean') {
				propHasErr = prop
				break
			}
		} else {
			if (typeof req.body.fields[prop] !== 'number') {
				propHasErr = prop
				break
			}
		}
	}
	if (propHasErr) {
		return res.status(200).json({ success: false, message: `The ${propHasErr} field is not correct.` })
	}
	next()
}
function checkBulkRemoveReq(req, res, next) {
	if (!Array.isArray(req.body.ids) || !req.body.ids?.length) {
		return res.status(200).json({ success: false, message: 'The list of ids is not correct' })
	}
	next()
}
function checkInputsBeforeCreate(req, res, next) {
	const helper = checkInputsBeforeCreateHelper(req.body);
	if (helper.hasErr) {
		return res.json({ success: false, message: helper.errMessages });
	}
	if (req.body.type === 'variable') {
		if (req.body.variations?.length) {
			for (const variation of req.body.variations) {
				const variationHelper = checkInputsBeforeCreateHelper(variation);
				if (variationHelper.hasErr) {
					return res.json({ success: false, message: helper.errMessages });
				}
			}
		} else {
			return res.json({ success: false, message: 'You did not set variations.' });
		}
	}
	next();
}
function checkInputsBeforeCreateHelper(inputs) {
	let hasErr = false
	let errMessages = []
	const TYPES = [
		"simple",
		"variable",
		"variation",
		"composite",
		"bundle"
	]
	const STATUS = [
		"draft",
		"pending",
		"private",
		"publish",
		"available",
		"unavailable"
	]
	const {
		name,
		barcode,
		type,
		status,
		price,
		discount,
		onlinePrice,
		onlineDiscount,
		stock,
		infiniteStock,
		onlineStock,
		onlineSell,
		weight,
		dimensions
	} = inputs
	if (!name) {
		hasErr = true
		errMessages.push('The name field is required.')
	}
	if (!barcode) {
		hasErr = true
		errMessages.push('The barcode field is required.')
	}
	if (!type) {
		hasErr = true
		errMessages.push('The type field is required.')
	}
	if (!TYPES.includes(type)) {
		hasErr = true
		errMessages.push('The type field is invalid.')
	}
	if (!status) {
		hasErr = true
		errMessages.push('The status field is required.')
	}
	if (!STATUS.includes(status)) {
		hasErr = true
		errMessages.push('The status field is invalid.')
	}
	if (price !== undefined) {
		if (isNaN(price) || price < 0) {
			hasErr = true
			errMessages.push('The price must be a positive number.')
		}
	}
	if (discount !== undefined) {
		if (isNaN(discount) || discount < 0 || discount > 100) {
			hasErr = true
			errMessages.push('The discount must be between 0 to 100.')
		}
	}
	if (onlinePrice !== undefined) {
		if (isNaN(onlinePrice) || onlinePrice < 0) {
			hasErr = true
			errMessages.push('The online price must be a positive number.')
		}
	}
	if (onlineDiscount !== undefined) {
		if (isNaN(onlineDiscount) || onlineDiscount < 0 || onlineDiscount > 100) {
			hasErr = true
			errMessages.push('The online discount must be between 0 to 100.')
		}
	}
	if (stock !== undefined) {
		if (isNaN(stock) || stock < 0) {
			hasErr = true
			errMessages.push('The stock must be a positive number.')
		}
	}
	if (onlineStock !== undefined) {
		if (isNaN(onlineStock) || onlineStock < 0) {
			hasErr = true
			errMessages.push('The online stock must be a positive number.')
		}
	}
	if (infiniteStock !== undefined) {
		if (typeof infiniteStock !== 'boolean') {
			hasErr = true
			errMessages.push('The infinite stock must be a boolean.')
		}
	}
	if (onlineSell !== undefined) {
		if (typeof onlineSell !== 'boolean') {
			hasErr = true
			errMessages.push('The infinite stock must be a boolean.')
		}
	}
	if (weight !== undefined) {
		if (isNaN(weight) || weight < 0) {
			hasErr = true
			errMessages.push('The weight must be a positive number.')
		}
	}
	if (dimensions !== undefined) {
		for (const prop in dimensions) {
			if (dimensions[prop] !== undefined) {
				if (isNaN(dimensions[prop]) || dimensions[prop] < 0) {
					hasErr = true
					errMessages.push(`The ${prop} must be a positive number.`)
				}
			}
		}
	}

	return { hasErr, errMessages }
}

module.exports = {
	checkBulkEditReq,
	checkBulkRemoveReq,
	checkInputsBeforeCreate
}