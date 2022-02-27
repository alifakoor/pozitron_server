'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../conn');

const Tag = sequelize.define('tag', {
	ref: DataTypes.BIGINT.UNSIGNED, // woocommerce category's id
	name: DataTypes.STRING(200),
	slug: DataTypes.STRING(200),
	description: DataTypes.TEXT,
	count: {
		type: DataTypes.BIGINT.UNSIGNED,
		default: 0
	},
	link: DataTypes.TEXT
}, {
	tableName: 'tags',
	timestamps: true,
	indexes: [
		{
			unique: true,
			fields: ['ref', 'businessId']
		}
	]
});

module.exports = Tag;