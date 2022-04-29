'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../conn');

const Business = sequelize.define('business', {
	domain: {
		type: DataTypes.STRING(200),
		allowNull: true,
		// unique: true,
		validate: {
			// is: /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/i
			isUrl: true
		}
	},
	title: DataTypes.STRING(150),
	description:  DataTypes.TEXT,
	onlineBusiness: DataTypes.BOOLEAN,
	key: {
		type: DataTypes.STRING(50),
		allowNull: true,
		validate: {
			is: /^(ck_)(.+)/i
		}
	},
	secret: {
		type: DataTypes.STRING(50),
		allowNull: true,
		validate: {
			is: /^(cs_)(.+)/i
		}
	},
	status: DataTypes.BOOLEAN
}, {
	tableName: 'businesses',
	timestamps: true
});

module.exports = Business;