module.exports = (sequelize, Sequelize) => {
    const BUSINESS = sequelize.define("business", {
        reference_id: {
            type: Sequelize.BIGINT(11),
            unique: true
        },
        subdomain: {
            type: Sequelize.STRING(100),
            allowNull: false,
            unique: true,
            validate: {
                is: ["^[a-zA-Z0-9_]+$", 'i'],
                len: [1, 200]
            }
        },
        title: {
            type: Sequelize.STRING(200), // VARCHAR(150)
            validate: {
                len: [2, 200]
            }
        },
        description: {
            type: Sequelize.TEXT,
        },
        active: {
            type: Sequelize.BOOLEAN
        }
    }, {
        underscored: true
    })
    return BUSINESS
}