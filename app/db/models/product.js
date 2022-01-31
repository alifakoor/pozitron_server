'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../conn');
const ProductImage = require('./productImage');
const ProductMeta = require('./productmeta');

const Product = sequelize.define('product', {
	ref: DataTypes.BIGINT(11), // woocommerce product's id
	name: {
		type: DataTypes.STRING(200),
		allowNull: false
	},
	barcode: {
		type: DataTypes.STRING(50),
		allowNull: false
	},
	type: {
		type: DataTypes.STRING(20),
		allowNull: false,
		validate: {
			isIn: [[
				"simple",
				"variable",
				"variation",
				"composite",
				"bundle"
			]]
		}
	},
	status: {
		type: DataTypes.STRING(20),
		allowNull: false,
		validate: {
			isIn: [[
				"draft",
				"pending",
				"private",
				"publish",
				"available",
				"unavailable"
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
		}
	]
});

// associations
Product.hasMany(Product, {
	as: 'variations',
	foreignKey: 'parentId'
});
Product.hasMany(ProductImage, {
	as: 'images'
});
ProductImage.belongsTo(Product);
Product.hasMany(ProductMeta, {
	as: 'meta'
});
ProductMeta.belongsTo(Product);

module.exports = Product;