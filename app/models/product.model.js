'use strict'

module.exports = (sequelize, DataTypes) => {
    const product = sequelize.define('product', {
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
        salePrice: {
            type: DataTypes.BIGINT(15),
            defaultValue: 0
        },
        onlinePrice: {
            type: DataTypes.BIGINT(15),
            defaultValue: 0
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
    },{
        indexes: [
            {
                unique: true,
                fields: ['ref', 'businessId']
            }
        ]
    })

    product.associate = function(db) {
        // between variation and variable
        db.product.hasMany(db.product, {
            as: 'variations',
            foreignKey: 'parentId'
        })

        // between product and product image
        db.product.hasMany(db.productImage, {
            as: 'images'
        })
        db.productImage.belongsTo(db.product)

        // between product and product meta
        db.product.hasMany(db.productmeta, {
            as: 'meta'
        })
        db.productmeta.belongsTo(db.product)
    }

    return product
}