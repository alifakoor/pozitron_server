const jwt = require("jsonwebtoken")
const db = require("../models")
const User = db.user

const SECRET_KEY = 'This is Secret Key'

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"]

    if (!token)
        return res.status(403).send({
            message: "No token provided."
        })

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err)
            return res.status(401).send({
                message: "Unauthorized!"
            })
        const date = new Date()
        if (Math.floor(date.getTime() / 1000) > decoded.exp){
            return res.status(401).send({
                message: "Unauthorized!"
            })
        }
        req.userId = decoded.id
        req.businessId = decoded.business_id
        next()
    })
}

isAdmin = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        if(user.kind === "admin"){
            next()
            return
        }

        res.status(403).send({
            message: "Require Admin Kind!"
        })
        next()
    })
}

const authJWT = {
    verifyToken: verifyToken,
    isAdmin: isAdmin
}

module.exports = authJWT