const mysql = require("mysql")
const dbConfig = require("../config/db.config.js")

// create a connection to the database
const connection = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASS,
    database: dbConfig.DB
})

// open the mysql connection
connection.connect(err => {
    if(err) throw err
    console.log("successfully connected to the database")
})

module.exports = connection