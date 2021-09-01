module.exports = (sequelize, Sequelize) => {
    return sequelize.define("address", {
        title: {
            type: Sequelize.STRING(32)
        },
        address: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        city: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        state: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        postcode: {
            type: Sequelize.BIGINT(10),
            allowNull: false,
            unique: true
        }
    }, {
        underscored: true
    })
}