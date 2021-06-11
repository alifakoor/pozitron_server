module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define("products", {
        title: {
            type: Sequelize.STRING(200), // VARCHAR(150)
            validate: {
                len: [2, 200]
            }
        },
        description: {
            type: Sequelize.TEXT,
        },
        slug: {
            type: Sequelize.STRING(200),
            validate: {
                len: [2, 200]
            }
        },
        sku: {
            type: Sequelize.STRING(200),
            allowNull: false,
            unique: true,
            validate: {
                is: ["^[a-zA-Z0-9_]+$", 'i'],
                len: [1, 200]
            }
        },
        type: {
            type: Sequelize.STRING(20),
            validate: {
                isIn: [[
                    "simple",
                    "variable",
                    "product_variation",
                    "composite",
                    "bundle"
                ]]
            }
        },
        status: {
            type: Sequelize.STRING(20),
            validate: {
                isIn: [[
                    "draft",
                    "pending",
                    "private",
                    "publish",
                    "available",
                    "unavailable"
                ]]
            }
        }
    }, {
        underscored: true,
    })

    return Product
}