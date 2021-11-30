module.exports = (sequelize, DataTypes) => {
    return sequelize.define('userMeta', {
        metaKey: {
            type: DataTypes.STRING // VARCHAR(255)
        },
        metaValue: {
            type: DataTypes.TEXT('long')
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