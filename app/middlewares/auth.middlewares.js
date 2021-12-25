'use strict'

// json web token module
const jwt = require('jsonwebtoken')

// middleware's functions
function checkPhone(req, res, next) {
	if (!req.body.phone) {
		res.status(200).json({ success: false, message: 'The phone field is required.'})
	} else {
		// regex for persian phone numbers
		let regex = new RegExp(/^(\+98?)?{?(0?9[0-9]{9}}?)$/, 'g')
		let checkPhone = regex.test(req.body.phone)
		if (!checkPhone) {
			res.status(200).json({ success: false, message: 'The phone is not correct.' })
		} else {
			next()
		}
	}
}
function checkCode(req, res, next) {
	if (!req.body.code) {
		res.status(400).json({ success: false, message: 'The code field is required.'})
	} else {
		if (req.body.code < 1000 || req.body.code > 9999) {
			res.status(400).json({ success: false, message: `${req.body.code} is not correct.`})
		} else {
			next()
		}
	}
}
function verifyToken(req, res, next) {
	let token = req.headers["zi-access-token"]

	if (!token) {
		return res.status(403).json({ success: false, message: "No token provided." })
	}

	jwt.verify(token, 'SECRET_KEY', (err, decoded) => {
		if (err) {
			return res.status(401).json({ success: false, message: "Unauthorized!" })
		}
		// const date = new Date()
		// if (Math.floor(date.getTime() / 1000) > decoded.exp){
		//     return res.status(401).send({
		//         message: "Unauthorized!"
		//     })
		// }
		req.user = decoded.user
		next()
	})
}
function checkDomainAndKeys(req, res, next) {
	if (!req.body.domain || !req.body.key || !req.body.secret) {
		return res.status(200).json({ success: false, message: 'The domain, key and secret fields are required.' })
	}

	// regex for validation domain
	let regexDomain = new RegExp(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/, 'gi')
	let checkDomain = regexDomain.test(req.body.domain)
	if (!checkDomain) {
		return res.status(200).json({ success: false, message: 'The domain is not correct.' })
	}
	req.body.domain = req.body.domain.replace(/(https:\/\/)|(http:\/\/)|(www.)/gi, '')

	// regex for validation consumer key
	let regexKey = new RegExp(/^(ck_)(.+)/, 'gi')
	let checkKey = regexKey.test(req.body.key)
	if (!checkKey) {
		return res.status(200).json({ success: false, message: 'The consumer key is not correct.' })
	}

	// regex for validation consumer secret
	let regexSecret = new RegExp(/^(cs_)(.+)/, 'gi')
	let checkSecret = regexSecret.test(req.body.secret)
	if (!checkSecret) {
		return res.status(200).json({ success: false, message: 'The consumer secret is not correct.' })
	}

	next()
}
function verifyWebhook(req, res, next) {
	if (!req.params.businessId || !req.params.businessKey) {
		return res.status(200).json({ success: false, message: 'The business id and key are required.' })
	}

	// regex for validation consumer key
	let regexKey = new RegExp(/^(ck_)(.+)/, 'gi')
	let checkKey = regexKey.test(req.params.businessKey)
	if (!checkKey) {
		return res.status(200).json({ success: false, message: 'The consumer key is not correct.' })
	}

	next()
}


// checkBusinessExist = (req, res, next) => {
//     BUSINESS.findOne({
//         where:{
//             subdomain: req.body.subdomain
//         }
//     }).then(business => {
//         if (!business) {
//             res.status(404).send({
//                 message: "Signup Failed! business does not exist"
//             })
//             return
//         }
//         next()
//     })
// }
// checkUserBusiness = (req, res, next) => {
//     USER.findOne({
//         where: {
//             username: req.body.username
//         }
//     }).then(user => {
//         BUSINESS.findOne({
//             where: {
//                 subdomain: req.body.subdomain
//             }
//         }).then((business) => {
//             if (user.businessId !== business.id) {
//                 res.status(404).send({
//                     message: "Signin Failed! your business is different"
//                 })
//                 return
//             }
//             next()
//         })
//     })
// }

// export middleware
module.exports = {
	checkPhone,
	checkCode,
	verifyToken,
	checkDomainAndKeys,
	verifyWebhook
}