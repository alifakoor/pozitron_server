module.exports = (sequelize, Sequelize) => {
    const Ordermeta = sequelize.define("order_meta", {
        meta_key: {
            type: Sequelize.STRING // VARCHAR(255)
        },
        meta_value: {
            type: Sequelize.TEXT('long')
        }
    }, {
        underscored: true
    })

    return Ordermeta
}