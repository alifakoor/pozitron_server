module.exports = (sequelize, Sequelize) => {
    return sequelize.define("terms", {
        reference_id: {
            type: Sequelize.BIGINT(11),
            unique: true
        },
        name: {
            type: Sequelize.STRING(200), // VARCHAR(200)
            validate: {
                len: [1, 200]
            }
        },
        description: {
            type: Sequelize.TEXT,
        },
        slug: {
            type: Sequelize.STRING(200),
            validate: {
                len: [1, 200]
            }
        },
        count: {
            type: Sequelize.BIGINT(11),
            defaultValue: 0
        },
        type: {
            type: Sequelize.STRING(20),
            validate: {
                isIn: [[
                    "category",
                    "tag"
                ]]
            }
        },
        status: {
            type: Sequelize.STRING(20),
            validate: {
                isIn: [[
                    "unknown",
                    "active",
                    "deactivate"
                ]]
            }
        },
        link: {
            type: Sequelize.TEXT
        }
    }, {
        underscored: true
    })
}