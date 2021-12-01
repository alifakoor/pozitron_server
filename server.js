// Modules
const express = require('express')
const bodyParser = require('body-parser')
const db = require('./app/db')

const app = express()
const port = process.env.PORT || 8081

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// APIs - version 1
require('./app/api/v1')(app)

// Routes
require('./app/routes')(app)

db.sequelize
    .sync({
        // force: true,
        logging: false
    })
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is Running on port ${port}`)
        })
    })
    .catch(err => {
        console.log(err)
    })

// SOCKET
// const { socket } = require('./app/middlewares')
// global.SOCKET = new socket(httpServer)

// statics files
// app.use(express.static('app/statics'))

// const cors = require("cors")
// const corsOptions = {
//     origin: ["http://pozitron.local", "http://localhost:8080"]
// }
// app.use(cors(corsOptions))

// const httpServer = require("http").createServer(app)
// httpServer.listen(PORT, () => {
//     console.log(`Server is Running on port ${PORT}`)
// })

// some changes for test
