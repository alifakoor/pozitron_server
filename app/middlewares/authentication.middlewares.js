const db = require("../models")
const USER = db.user
const BUSINESS = db.business

checkDuplicateUsernameOrPhone = (req, res, next) => {
    // username
    USER.findOne({
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
        USER.findOne({
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

checkBusinessExist = (req, res, next) => {
    BUSINESS.findOne({
        where:{
            subdomain: req.body.subdomain
        }
    }).then(business => {
        if (!business) {
            res.status(404).send({
                message: "Signup Failed! business does not exist"
            })
            return
        }
        next()
    })
}

checkUserBusiness = (req, res, next) => {
    USER.findOne({
        where: {
            username: req.body.username
        }
    }).then(user => {
        BUSINESS.findOne({
            where: {
                subdomain: req.body.subdomain
            }
        }).then((business) => {
            if (user.businessId !== business.id) {
                res.status(404).send({
                    message: "Signin Failed! your business is different"
                })
                return
            }
            next()
        })
    })
}

const authentication = {
    checkDuplicateUsernameOrPhone,
    checkBusinessExist,
    checkUserBusiness
}

module.exports = authentication