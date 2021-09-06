const DB = require('../models')
const USER = DB.user
const BUSINESS = DB.business

checkUserBusinessByUserId = (req, res, next) => {
    BUSINESS.findOne({
        where: {
            id: req.businessId
        }
    }).then(business => {
        if (!business) {
            res.status(404).send({
                message: "Request Failed! this business doesn't exist!"
            })
            return
        }

        USER.findOne({
            where: {
                id: req.userId
            }
        }).then(user => {
            if (!user) {
                res.status(404).send({
                    message: "Request Failed! this user doesn't exist!"
                })
                return
            }
            if (user.businessId !== req.businessId) {
                res.status(404).send({
                    message: "Request Failed! your business is different"
                })
                return
            }
            next()
        })
    })
}

const authorization = {
    checkUserBusinessByUserId
}

module.exports = authorization