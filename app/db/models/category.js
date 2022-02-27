'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../conn');

const Category = sequelize.define('category', {
	ref: DataTypes.BIGINT.UNSIGNED, // woocommerce category's id
	name: DataTypes.STRING(200),
	slug: DataTypes.STRING(200),
	description: DataTypes.TEXT,
	image: DataTypes.TEXT,
	count: {
		type: DataTypes.BIGINT.UNSIGNED,
		default: 0
	},
	link: DataTypes.TEXT
}, {
	tableName: 'categories',
	timestamps: true,
	indexes: [
		{
			unique: true,
			fields: ['ref', 'businessId']
		}
	]
});

module.exports = Category;