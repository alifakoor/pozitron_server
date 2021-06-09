module.exports = (sequelize, Sequelize) => {
    const Usermeta = sequelize.define("user_meta", {
        meta_key: {
            type: Sequelize.STRING // VARCHAR(255)
        },
        meta_value: {
            type: Sequelize.TEXT('long')
        }
    }, {
        underscored: true,
        indexes: [
            {
                unique: true,
                fields: ['meta_key', 'user_id']
            }
        ]
    })

    return Usermeta
}