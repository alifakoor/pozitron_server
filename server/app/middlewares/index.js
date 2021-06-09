const authJWT = require("./authJWT.middlewares")
const verifySignup = require("./verifySignup.middlewares")
const uploadFiles = require("./uploadFile.middlewares")
const socket = require("./socket.middlewares")

module.exports = {
    authJWT,
    verifySignup,
    uploadFiles,
    socket
}