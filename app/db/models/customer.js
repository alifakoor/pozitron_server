'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../conn');

const Customer = sequelize.define('customer', {
	ref: DataTypes.BIGINT.UNSIGNED, // woocommerce order's id
	username: DataTypes.STRING,
	firstname: DataTypes.STRING,
	lastname: DataTypes.STRING,
	email: DataTypes.STRING,
	phoneNumber: DataTypes.STRING(15),
}, {
	tableName: 'customers',
	timestamps: true
});

module.exports = Customer;