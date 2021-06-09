module.exports = (sequelize, Sequelize) => {
    const Productmeta = sequelize.define("product_meta", {
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
                fields: ['meta_key', 'product_id']
            }
        ]
    })

    return Productmeta
}