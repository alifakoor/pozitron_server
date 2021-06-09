const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")

const app = express()
const corsOptions = {
    origin: "http://localhost:8080"
}
app.use(cors(corsOptions))

const httpServer = require("http").createServer(app)

// SOCKET
const { socket } = require('./app/middlewares')
global.SOCKET = new socket(httpServer)

// parse requests of content-type: application/json
app.use(bodyParser.json())

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// statics files
app.use(express.static('app/statics'))

const db = require("./app/models")
db.sequelize.sync()

// routes
require("./app/routes/auth.routes.js")(app)
require("./app/routes/settings.routes")(app)
require("./app/routes/general.routes")(app)
require("./app/routes/user.routes.js")(app)
require("./app/routes/product.routes.js")(app)
require("./app/routes/category.routes.js")(app)
require("./app/routes/order.routes.js")(app)
require("./app/routes/invoice.routes.js")(app)

// set port, listen for requests
const PORT = process.env.PORT || 8081
httpServer.listen(PORT, () => {
    console.log(`Server is Running on port ${PORT}`)
})
// app.listen(PORT, () => {
//     console.log(`Server is Running on port ${PORT}`)
// })