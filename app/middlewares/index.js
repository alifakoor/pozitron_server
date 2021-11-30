const authJWT = require("./authJWT.middlewares")
const authN = require("./auth.middlewares")
const authZ = require("./authorization.middlewares")
const uploadFiles = require("./uploadFile.middlewares")
const socket = require("./socket.middlewares")

module.exports = {
    authJWT,
    authN,
    authZ,
    uploadFiles,
    socket
}