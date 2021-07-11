module.exports = (sequelize, Sequelize) => {
    const Order = sequelize.define("orders", {
        reference_id: {
            type: Sequelize.BIGINT(11),
            unique: true
        },
        order_key: {
            type: Sequelize.STRING(10), // VARCHAR(255)
            validate: {
                is: ["^[a-zA-Z0-9_]+$", 'i'],
                len: [3, 100]
            }
        },
        total_price: {
            type: Sequelize.BIGINT(11),
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
                    "completed",
                    "processing",
                    "canceled",
                    "pending-payment",
                    "on-hold",
                    "failed",
                    "refunded",
                    "authentication-required"
                ]]
            }
        },
        source: {
            type: Sequelize.INTEGER(2),
            validate: {
                isIn: [[
                    0,
                    1
                ]]
            }
        }
    }, {
        underscored: true,
    })

    return Order
}