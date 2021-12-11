// Modules
const express = require('express')
const cors = require("cors")
const db = require('./app/db')

const app = express()
const port = process.env.PORT || 8081

const corsOptions = {
    origin: ["https://dev.pozitronet.ir", "http://localhost:8080", "http://localhost:3000"]
}
app.use(cors(corsOptions))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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

// const httpServer = require("http").createServer(app)
// httpServer.listen(PORT, () => {
//     console.log(`Server is Running on port ${PORT}`)
// })

// some changes for test
// some another changes for test
