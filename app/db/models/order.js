'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../conn');

const Order = sequelize.define('order', {
	ref: DataTypes.BIGINT.UNSIGNED, // woocommerce order's id
	src: DataTypes.ENUM('online', 'offline'),
	orderKey: DataTypes.STRING,
	status: {
		type: DataTypes.ENUM('any', 'pending', 'processing', 'on-hold', 'completed', 'cancelled', 'refunded', 'failed', 'trash'),
		defaultValue: 'pending'
	},
	currency: {
		type: DataTypes.ENUM('IRR', 'IRT', 'USD', 'EUR'),
		defaultValue: 'IRT'
	},
	discountTotal: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		validate: {
			min: 0,
			max: 100
		}
	},
	shippingTotal: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		validate: {
			min: 0
		}
	},
	totalPrice: {
		type: DataTypes.BIGINT,
		defaultValue: 0,
		validate: {
			min: 0
		}
	},
	totalTax: {
		type: DataTypes.BIGINT,
		defaultValue: 0,
		validate: {
			min: 0
		}
	},
	deliveryDate: DataTypes.DATEONLY
}, {
	tableName: 'orders',
	timestamps: true,
	indexes: [
		{
			unique: true,
			fields: ['ref', 'businessId']
		}
	]
});

module.exports = Order;