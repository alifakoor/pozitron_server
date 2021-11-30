'use strict'

const fs = require('fs')
const path = require('path')
const { Sequelize, DataTypes, Op } = require('sequelize')
const config = require('./config')

const modelsPath = path.join(`${__dirname}/../models`)
const db = {}

db.sequelize = new Sequelize(config.DB, config.USER, config.PASS, {
    host: config.HOST,
    dialect: config.dialect,
    timezone: '+03:30',
    define: {
        freezeTableName: true
    },
    pool: {
        max: config.pool.max,
        min: config.pool.min,
        acquire: config.pool.acquire,
        idle: config.pool.idle
    }
})

fs.readdirSync(modelsPath)
    .filter(file => file.match(/\w+.model.js/g))
    .map(file => {
        const model = require(path.join(modelsPath, file))(db.sequelize, DataTypes)
        db[model.name] = model
    })

Object.keys(db).map(model => {
    if (db[model].associate) db[model].associate(db)
})

module.exports = db