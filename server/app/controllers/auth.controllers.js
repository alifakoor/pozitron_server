const db = require("../models")
const config = require("../config/auth.config.js")
const User = db.user

const Op = db.Sequelize.Op

var jwt = require("jsonwebtoken")
var bcrypt = require("bcryptjs")

exports.signup = (req, res) => {
    // save user to database
    User.create({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 8),
        fullname: req.body.fullname,
        email: req.body.email,
        phone: req.body.phone,
        kind: "user",
        status: "active"
    }).then(() => {
        res.status(200).send({
            success: true,
            message: "ثبت نام با موفقیت انجام شد."
        })
    }).catch(err => {
        res.status(500).send({ message: err.message })
    })
}

exports.signin = (req, res) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    }).then(user => {
        if (!user)
            return res.status(404).send({
                message: "User not found."
            })

        let passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        )

        if (!passwordIsValid)
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password."
            })

        let token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: 86400 // 24 hours
        })

        res.status(200).send({
            id: user.id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            kind: user.kind,
            status: user.status,
            created_at: user.createdAt,
            token: token
        })

    }).catch(err => {
        res.status(500).send({ message: err.message })
    })
}