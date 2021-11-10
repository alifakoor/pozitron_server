module.exports = (sequelize, Sequelize) => {
    const OrderItems = sequelize.define("order_items", {
        id: {
            type: Sequelize.BIGINT(20),
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        price: {
            type: Sequelize.BIGINT(11),
        },
        count: {
            type: Sequelize.BIGINT(11),
        },
        discount: {
            type: Sequelize.TEXT('long'),
            set(value) {
                this.setDataValue('discount', JSON.stringify(value))
            }
        },
        type: {
            type: Sequelize.STRING(20),
            validate: {
                isIn: [[
                    "type_1",
                    "type_2"
                ]]
            }
        },
        status: {
            type: Sequelize.STRING(50),
            validate: {
                isIn: [[
                    "active",
                    "inactive"
                ]]
            }
        }
    }, {
        underscored: true,
        indexes: [
            {
                unique: true,
                fields: ['product_id', 'order_id']
            }
        ]
    })

    return OrderItems
}