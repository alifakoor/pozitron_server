'use strict'

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('productImage', {
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
        indexes: [
            {
                unique: true,
                fields: ['src', 'productId']
            }
        ]
    })
}