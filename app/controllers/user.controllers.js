const jwt = require('jsonwebtoken')
const db = require('../db')
const smsHelper = require('../helpers/sms.helpers')

function loginOrRegister(req, res) {
    smsHelper.send(req.body.phone, (smsRes, code) => {
        if (smsRes.status === 200 && typeof smsRes.data === 'number') {
            db.user
                .upsert({
                    phone: req.body.phone,
                    code: code,
                    codeCreatedAt: new Date()
                })
                .then(row => {
                    const [ user, created ] = row
                    user.setDataValue('existed', !created)
                    // user.setDataValue('code', null)
                    user.setDataValue('codeCreatedAt', null)
                    return user
                })
                .then(user => {
                    user.countBusinesses()
                        .then(counter => {
                            user.setDataValue('hasBusiness', !!counter)
                            res.status(200).json({
                                success: true,
                                message: 'code sent successfully.',
                                data: user
                            })
                        })
                        .catch(err => {
                            console.log(err)
                            res.status(500).send({ success: false, message: err.message })
                        })
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).send({ success: false, message: err.message })
                })
        } else {
            res.status(500).json({
                success: false,
                message: 'The code has not sent successfully, please try again.'
            })
        }
    })
}

function verifyCode(req, res) {
    db.user
        .findOne({
            where: {
                phone: req.body.phone
            }
        })
        .then(user => {
            if (!user || !user.code) {
                throw new Error('The phone or code not found.')
            }

            if (user.code !== req.body.code) {
                throw new Error('The code is not correct.')
            }

            const now = new Date()
            const codeCreatedAt = new Date(user.codeCreatedAt)
            const second = Math.floor((now.getTime() - codeCreatedAt.getTime()) / 1000)
            if (second >= 86400) {
                throw new Error('The code has expired.')
            }

            let token = jwt.sign({user}, 'SECRET_KEY', { expiresIn: 86400 })

            user.setDataValue('token', token)

            res.status(200).json({
                success: true,
                message: 'You login successfully.',
                data: user
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).send({ success: false, message: err.message })
        })
}

function create(req, res) {
    db.user
        .create({
            phone: req.body.phone
        })
        .then(user => {
            res.json(user)
        })
        .catch(err => {
            console.log(err)
        })
}

// exports.signin = (req, res) => {
//     USER.findOne({
//         where: {
//             username: req.body.username
//         }
//     }).then(user => {
//         if (!user)
//             return res.status(404).send({
//                 message: "User not found."
//             })
//
//         let passwordIsValid = bcrypt.compareSync(
//             req.body.password,
//             user.password
//         )
//
//         if (!passwordIsValid)
//             return res.status(401).send({
//                 accessToken: null,
//                 message: "Invalid Password."
//             })
//
//         let token = jwt.sign({ id: user.id, business_id: user.businessId }, SECRET_KEY, {
//             expiresIn: TOKEN_EXPIRATION_DURATION // 24 hours
//         })
//
//         const date = new Date()
//
//         res.status(200).send({
//             id: user.id,
//             username: user.username,
//             email: user.email,
//             phone: user.phone,
//             kind: user.kind,
//             status: user.status,
//             created_at: user.createdAt,
//             business_id: user.business_id,
//             token: token,
//             token_expiration: Math.floor(date.getTime() / 1000) + TOKEN_EXPIRATION_DURATION
//         })
//
//     }).catch(err => {
//         res.status(500).send({ message: err.message })
//     })
// }

module.exports = {
    loginOrRegister,
    verifyCode
}