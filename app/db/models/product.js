'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../conn');
const ProductImage = require('./productImage');
const ProductMeta = require('./productmeta');
const Category = require('./category');

const Product = sequelize.define('product', {
	ref: DataTypes.BIGINT(11), // woocommerce products's id
	name: {
		type: DataTypes.STRING(200),
		allowNull: false
	},
	barcode: DataTypes.STRING(50),
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
	status: {
		type: DataTypes.ENUM('draft', 'pending', 'private', 'publish', 'available', 'unavailable'),
		defaultValue: 'publish',
		validate: {
			isIn: [[
				'draft',
				'pending',
				'private',
				'publish',
				'available',
				'unavailable'
			]]
		}
	},
	price: {
		type: DataTypes.BIGINT(15),
		defaultValue: 0,
	},
	discount: {
		type: DataTypes.INTEGER(3),
		defaultValue: 0,
		validate: {
			min: 0,
			max: 100
		}
	},
	salePrice: {
		type: DataTypes.BIGINT(15),
		defaultValue: 0
	},
	onlinePrice: {
		type: DataTypes.BIGINT(15),
		defaultValue: 0
	},
	onlineDiscount: {
		type: DataTypes.INTEGER(3),
		defaultValue: 0,
		validate: {
			min: 0,
			max: 100
		}
	},
	onlineSalePrice: {
		type: DataTypes.BIGINT(15),
		defaultValue: 0
	},
	stock: {
		type: DataTypes.INTEGER,
		defaultValue: 0
	},
	infiniteStock: {
		type: DataTypes.BOOLEAN,
		defaultValue: false
	},
	onlineStock: {
		type: DataTypes.INTEGER,
		defaultValue: 0
	},
	reservationStock: {
		type: DataTypes.INTEGER,
		defaultValue: 0
	},
	onlineSell: {
		type: DataTypes.BOOLEAN,
		defaultValue: false
	},
	description: DataTypes.TEXT
}, {
	tableName: 'products',
	timestamps: true,
	indexes: [
		{
			unique: true,
			fields: ['ref', 'businessId']
		},
		// {
		// 	unique: true,
		// 	fields: ['barcode', 'businessId']
		// }
	]
});

module.exports = Product;