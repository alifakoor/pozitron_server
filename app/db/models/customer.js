'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../conn');

const Customer = sequelize.define('customer', {
	ref: DataTypes.BIGINT.UNSIGNED, // woocommerce order's id
	username: DataTypes.STRING,
	firstname: DataTypes.STRING,
	lastname: DataTypes.STRING,
	email: DataTypes.STRING,
	phone: {
		type: DataTypes.BIGINT(11).UNSIGNED,
		allowNull: false,
		unique: true,
		validate: {
			is: /^(0)?9\d{9}$/i
		}
	}
}, {
	tableName: 'customers',
	timestamps: true,
	indexes: [
		{
			unique: true,
			fields: ['ref', 'businessId']
		},
		{
			unique: true,
			fields: ['phone', 'businessId']
		}
	]
});

module.exports = Customer;