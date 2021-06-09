const db = require("../models")
const User = db.user

checkDuplicateUsernameOrPhone = (req, res, next) => {
    // username
    User.findOne({
        where: {
            username: req.body.username
        }
    }).then(user => {
        if (user) {
            res.status(400).send({
                message: "Signup Failed! username is already in use"
            })
            return
        }

        // email
        User.findOne({
            where: {
                phone: req.body.phone
            }
        }).then(user => {
            if (user) {
                res.status(400).send({
                    message: "Signup Failed! phone is already in use"
                })
                return
            }

            next()
        })
    })
}

const verifySignup = {
    checkDuplicateUsernameOrPhone
}

module.exports = verifySignup