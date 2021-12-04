const axios = require('axios')

const SMS_USER = '09380933022'
const SMS_PASS = 'Test2424'
const MIN_CODE = 1000
const MAX_CODE = 9999

function send(phone, callback) {
    let code = Math.floor(Math.random() * (MAX_CODE - MIN_CODE) + MIN_CODE)
    // axios
    //     .post('http://ippanel.com/api/select', {
    //         "op" : 'pattern',
    //         "user" : SMS_USER,
    //         "pass":  SMS_PASS,
    //         "fromNum": '3000505',
    //         "toNum" : phone.toString(),
    //         "patternCode": "9hxlb8d2or",
    //         "inputData": [{
    //                 "name": 'کاربر',
    //                 "code": code
    //         }]
    //     })
    //     .then(res => {
    //         callback(res, code)
    //     })
    //     .catch(err => {
    //         console.log(`sms error ====> ${err}`)
    //     })
    setTimeout(() => {
        callback({data: 1, status: 200}, code)
    }, 1000)
}

module.exports = { send }