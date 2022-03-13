const jwt = require('jsonwebtoken');
const SmsHelpers = require('../helpers/sms.helpers');

const BaseErr = require('../errors/baseErr');
const httpStatusCodes = require('../errors/httpStatusCodes');

const User = require('../db/models/user');

async function loginOrRegister(req, res, next) {
	try {
		const sms = new SmsHelpers(req.body.phone);
		const { status, data } = await sms.send();
		if(status !==200 || typeof data !== 'number') {
			throw new BaseErr(
				'SmsNotSent',
				httpStatusCodes.INTERNAL_SERVER_ERROR,
				false,
				`Sending sms failed, Error: ${data[1]}`
			);
		}

		const [ user, created ] = await User.upsert({
			phone: req.body.phone,
			code: sms.getCode(),
			codeCreatedAt: Date.now()
		});
		user.setDataValue('existed', !created);
		user.code = null;
		user.codeCreatedAt = null;

		const hasBusiness = await user.countBusinesses();
		user.setDataValue('hasBusiness', !!hasBusiness);

		return res.json({
			success: true,
			message: 'code sent successfully.',
			data: user
		});

	} catch(e) {
		next(e);
	}
}
async function verifyCode(req, res, next) {
	try {
		const user = await User.findOne({ where: { phone: req.body.phone }});
		if(!user || !user.code) {
			throw new BaseErr(
				'UserDoesNotExist',
				httpStatusCodes.NOT_FOUND,
				true,
				`There is no user.`
			);
		}
		if(user.code !== req.body.code) {
			throw new BaseErr(
				'CodeIsNotCorrect',
				httpStatusCodes.NOT_FOUND,
				true,
				`The code is not correct.`
			);
		}

		const now = new Date();
		const codeCreatedAt = new Date(user.codeCreatedAt);
		const second = Math.floor((now.getTime() - codeCreatedAt.getTime()) / 1000);
		const codeExpiration = Number(process.env.SMS_EXPIRATION) || 60 * 60 * 24;
		if (second >= codeExpiration) {
			throw new BaseErr(
				'CodeExpired',
				httpStatusCodes.NOT_FOUND,
				true,
				`The code has expired.`
			);
		}

		let token = jwt.sign({
			user: {
				id: user.id
			}
		}, process.env.JWT_SECRET, { expiresIn: +process.env.JWT_EXPIRATION || 86400 });

		user.setDataValue('token', token);

		return res.status(200).json({
			success: true,
			message: 'You login successfully.',
			data: user
		})
	} catch(e) {
		next(e);
	}
}

module.exports = {
	loginOrRegister,
	verifyCode
}