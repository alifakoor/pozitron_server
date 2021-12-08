'use strict'

module.exports = (sequelize, DataTypes) => {
    const user = sequelize.define('user', {
        phone: {
            type: DataTypes.BIGINT(11).UNSIGNED,
            allowNull: false,
            unique: true,
            validate: {
                is: /^(0)?9\d{9}$/i
            }
        },
        fullName: {
            type: DataTypes.STRING, // VARCHAR(255)
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
        codeCreatedAt: DataTypes.DATE,
        status: {
            type: DataTypes.STRING(20),
            validate: {
                isIn: [[
                    "active",
                    "deactivate"
                ]]
            }
        }
    })

    // associations
    user.associate = function(db) {
        // between user and user meta
        db.user.hasMany(db.userMeta)
        db.userMeta.belongsTo(db.user)

        // between user and business
        db.user.hasMany(db.business)
        db.business.belongsTo(db.user)
    }

    return user
}