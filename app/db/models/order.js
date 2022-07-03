'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../conn');

const Order = sequelize.define('order', {
	ref: DataTypes.BIGINT.UNSIGNED, // woocommerce order's id
	src: DataTypes.ENUM('online', 'offline'),
	orderKey: DataTypes.STRING,
	factorNumber: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
	},
	status: {
		type: DataTypes.ENUM('any', 'pending', 'processing', 'on-hold', 'completed', 'cancelled', 'refunded', 'failed', 'trash'),
		defaultValue: 'pending'
	},
	description: DataTypes.TEXT,
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
	discountPrice: {
		type: DataTypes.BIGINT,
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
	additionsPrice: {
		type: DataTypes.BIGINT,
		defaultValue: 0,
		validate: {
			min: 0
		}
	},
	deliveryDate: DataTypes.DATEONLY,
	deliveryTime: {
		type: DataTypes.ENUM('8-10', '10-12', '12-14', '14-16', '16-18', '18-20', '20-22', '22-24')
	}
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