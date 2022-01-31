const axios = require('axios');

// const {
// 	SMS_URL,
// 	SMS_USER,
// 	SMS_PASS,
// 	SMS_NUM,
// 	SMS_PATTERN_CODE,
// 	SMS_MIN_CODE,
// 	SMS_MAX_CODE
// } = process.env;

class SmsHelpers {
	constructor(phone) {
		this.phone = phone.toString();
		this.url = process.env.SMS_URL;
		this.user = process.env.SMS_USER;
		this.pass = process.env.SMS_PASS;
		this.number = process.env.SMS_NUM;
		this.pattern = process.env.SMS_PATTERN_CODE;
		this.code = Math.floor(Math.random() * (+process.env.SMS_MAX_CODE - +process.env.SMS_MIN_CODE) + +process.env.SMS_MIN_CODE);
	}

	send() {
		return axios
			.post(this.url,{
				op: 'pattern',
				user: this.user,
				pass:  this.pass,
				fromNum: this.number,
				toNum: this.phone,
				patternCode: this.pattern,
				inputData: [{
					"name": 'کاربر',
					"code": this.code
				}]
			});
	}

	getCode() {
		return this.code;
	}
}

function send(phone) {
	const code = Math.floor(Math.random() * (+SMS_MAX_CODE - +SMS_MIN_CODE) + +SMS_MIN_CODE);
	return axios
		.post(SMS_URL,{
			op: 'pattern',
			user: SMS_USER,
			pass:  SMS_PASS,
			fromNum: SMS_NUM,
			toNum: phone.toString(),
			patternCode: SMS_PATTERN_CODE,
			inputData: [{
				"name": 'کاربر',
				"code": code
			}]
		});
}

module.exports = SmsHelpers;