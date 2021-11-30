module.exports = (sequelize, Sequelize) => {
    const OrderItemmeta = sequelize.define("order_item_meta", {
        meta_key: {
            type: Sequelize.STRING // VARCHAR(255)
        },
        meta_value: {
            type: Sequelize.TEXT('long')
        }
    }, {
        underscored: true
    })

    return OrderItemmeta
}