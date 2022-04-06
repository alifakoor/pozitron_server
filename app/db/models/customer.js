'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../conn');

const Customer = sequelize.define('customer', {
	ref: DataTypes.BIGINT.UNSIGNED, // woocommerce order's id
	username: DataTypes.STRING,
	firstname: DataTypes.STRING,
	lastname: DataTypes.STRING,
	email: DataTypes.STRING,

}, {
	tableName: 'customers',
	timestamps: true,
	indexes: [
		{
			unique: true,
			fields: ['ref', 'businessId']
		}
	]
});

module.exports = Customer;