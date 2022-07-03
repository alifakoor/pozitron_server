'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../conn');
const Product = require('./product');
const Order = require('./order');

const OrderHasProducts = sequelize.define('orderHasProduct', {
	name: {
		type: DataTypes.STRING,
		allowNull: false
	},
	price: {
		type: DataTypes.BIGINT,
		defaultValue: 0,
	},
	type: {
		type: DataTypes.ENUM('simple', 'variable', 'variation', 'composite', 'bundle'),
		defaultValue: 'simple',
		validate: {
			isIn: [[
				'simple',
				'variable',
				'variation',
				'composite',
				'bundle'
			]]
		}
	},
	discount: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		validate: {
			min: 0,
			max: 100
		}
	},
	salePrice: {
		type: DataTypes.BIGINT,
	},
	onlinePrice: {
		type: DataTypes.BIGINT,
		defaultValue: 0
	},
	onlineDiscount: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		validate: {
			min: 0,
			max: 100
		}
	},
	onlineSalePrice: {
		type: DataTypes.BIGINT,
		defaultValue: 0
	},
	quantity: {
		type: DataTypes.INTEGER,
		defaultValue: 1,
		allowNull: false
	},
	total: DataTypes.BIGINT,
	totalTax: {
		type: DataTypes.INTEGER,
		defaultValue: 0
	}
}, {
	tableName: 'order_has_products',
	timestamps: true
});

module.exports = OrderHasProducts;