'use strict'

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('business', {
        domain: {
            type: DataTypes.STRING(200),
            allowNull: false,
            unique: true,
            validate: {
                is: ["^[a-zA-Z0-9_]+$", 'i'],
                len: [1, 200]
            }
        },
        title: DataTypes.STRING(150),
        description:  DataTypes.TEXT,
        status: DataTypes.BOOLEAN
    })
}