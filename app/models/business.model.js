'use strict'

module.exports = (sequelize, DataTypes) => {
    const business =  sequelize.define('business', {
        domain: {
            type: DataTypes.STRING(200),
            allowNull: false,
            unique: true,
            validate: {
                // is: /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/i
                isUrl: true
            }
        },
        title: DataTypes.STRING(150),
        description:  DataTypes.TEXT,
        key: {
            type: DataTypes.STRING(50),
            validate: {
                is: /^(ck_)(.+)/i
            }
        },
        secret: {
            type: DataTypes.STRING(50),
            validate: {
                is: /^(cs_)(.+)/i
            }
        },
        status: DataTypes.BOOLEAN
    })

    business.associate = function(db) {
        // between product and business
        db.business.hasMany(db.product)
        db.product.belongsTo(db.business)
    }

    return business
}