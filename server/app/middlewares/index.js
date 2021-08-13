const authJWT = require("./authJWT.middlewares")
const authentication = require("./authentication.middlewares")
const authorization = require("./authorization.middlewares")
const uploadFiles = require("./uploadFile.middlewares")
const socket = require("./socket.middlewares")

module.exports = {
    authJWT,
    authentication,
    authorization,
    uploadFiles,
    socket
}