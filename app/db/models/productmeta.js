'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../conn');

const ProductMeta = sequelize.define('productmeta', {
	metaKey: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			notEmpty: true
		}
	},
	metaValue: {
		type: DataTypes.TEXT,
		allowNull: false,
		validate: {
			notEmpty: true
		}
	}
}, {
	tableName: 'product_meta',
	timestamps: true,
	indexes: [
		{
			unique: true,
			fields: ['metaKey', 'productId']
		}
	]
});

module.exports = ProductMeta;