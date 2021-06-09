module.exports = (sequelize, Sequelize) => {
    const Customermeta = sequelize.define("customer_meta", {
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
                fields: ['meta_key', 'customer_id']
            }
        ]
    })

    return Customermeta
}