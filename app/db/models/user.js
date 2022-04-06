'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../conn');

const Business = require('./business');

const User = sequelize.define('user', {
	phone: {
		type: DataTypes.BIGINT(11).UNSIGNED,
		allowNull: false,
		unique: true,
		validate: {
			is: /^(0)?9\d{9}$/i
		}
	},
	fullName: {
		type: DataTypes.STRING,
		allowNull: true,
		validate: {
			is: ["^[a-zA-Z ]+$", 'i']
		}
	},
	email: {
		type: DataTypes.STRING,
		allowNull: true,
		validate: {
			isEmail: true,
		}
	},
	role: {
		type: DataTypes.STRING(20),
		validate: {
			isIn: [[
				"admin",
				"manager",
				"cashier"
			]]
		}
	},
	code: {
		type: DataTypes.INTEGER(4).UNSIGNED,
		validate: {
			len: 4
		}
	},
	codeCreatedAt: {
		type: DataTypes.DATE,
		defaultValue: Date.now
	},
	status: {
		type: DataTypes.STRING(20),
		validate: {
			isIn: [[
				"active",
				"inactive"
			]]
		}
	}
}, {
	tableName: 'users',
	timestamps: true
});

module.exports = User;