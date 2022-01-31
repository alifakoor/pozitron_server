'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../conn');

const ProductImage = sequelize.define('productImage', {
	src: {
		type: DataTypes.TEXT,
		allowNull: false,
		validate: {
			isUrl: true
		}
	},
	name: {
		type: DataTypes.STRING(150),
		allowNull: false,
		validate: {
			notEmpty: true
		}
	},
	index: {
		type: DataTypes.BOOLEAN,
		defaultValue: false
	}
}, {
	tableName: 'productImages',
	timestamps: true,
	indexes: [
		{
			unique: true,
			fields: ['name', 'productId']
		}
	]
});

module.exports = ProductImage;