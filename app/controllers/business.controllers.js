const db = require('../db')

function create(req, res) {
    // console.log(req.body)
    // console.log(req.user.id)
    db.business
        .findOne({
            where: {
                domain: req.body.domain
            }
        })
        .then(business => {
            if (business) {
                throw new Error('The business has already existed.')
            }
            db.business
                .create({
                    domain: req.body.domain,
                    key: req.body.key,
                    secret: req.body.secret,
                    userId: req.user.id
                })
                .then(created => {
                    if (!created) throw new Error('Something is wrong, please try again.')
                    res.status(200).json({
                        success: true,
                        message: 'The business is created.',
                        data: created
                    })
                })
                .catch(err => {
                    console.log(err)
                    res.status(404).json({ success: false, message: err.message })
                })
        })
        .catch(err => {
            console.log(err.message)
            res.status(404).json({ success: false, message: err.message })
        })
}

function check(req, res) {
    db.business
        .findOne({
            where: {
                domain: req.params.domain
            }
        })
        .then(business => {
            if (business) {
                res.status(200).json({ status: 'success', message: 'The domain exist.' })
            } else {
                throw new Error('The domain does not exist.')
            }
        })
        .catch(err => {
            console.log(err.message)
            res.status(404).json({ status: 'failure', message: err.message })
        })
}

module.exports = {
    create,
    check
}