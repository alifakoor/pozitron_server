'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../conn');

const Address = sequelize.define('address', {
	country: DataTypes.STRING(64),
	city: DataTypes.STRING(64),
	postCode: DataTypes.INTEGER,
	phone: DataTypes.STRING(15),
	address: DataTypes.TEXT
}, {
	tableName: 'addresses',
	timestamps: true
});

module.exports = Address;