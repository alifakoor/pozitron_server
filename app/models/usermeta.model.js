module.exports = (sequelize, DataTypes) => {
    return sequelize.define('userMeta', {
        metaKey: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        metaValue: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    }, {
        indexes: [
            {
                unique: true,
                fields: ['metaKey', 'userId']
            }
        ]
    })
}