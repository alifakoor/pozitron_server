/**
 * Requirements
 */
const _ = require('lodash')
const DB = require("../models")

/**
 * Models
 */
const Op = DB.Sequelize.Op
const USER = DB.user
const USER_META = DB.usermeta

exports.getUserWebsiteData = (req, res) => {
    USER_META.findAll({
        where: {
            userId: req.body.id
        }
    }).then(founded_meta => {
        founded_meta = _.chain(founded_meta).keyBy('meta_key').mapValues('meta_value').value()
        console.log(founded_meta)
        res.json(founded_meta)
    }).catch(err => console.log(err))
}

exports.setUserWebsiteData = (req, res) => {
    USER_META.bulkCreate([
        {
            meta_key: '_address',
            meta_value: req.body._address,
            userId: req.userId
        },
        {
            meta_key: '_consumer_key',
            meta_value: req.body._consumer_key,
            userId: req.userId
        },
        {
            meta_key: '_consumer_secret',
            meta_value: req.body._consumer_secret,
            userId: req.userId
        }
    ],{
        updateOnDuplicate: ['meta_value']
    }).then(upserted_rows => {
        console.log(upserted_rows)
    }).catch(err => console.log(err))
}

exports.syncVariableProducts = (req, res) => {

}

exports.userBoard = (req, res) => {
    res.status(200).send("User Content.")
}

exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content")
}