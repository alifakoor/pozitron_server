module.exports = (sequelize, Sequelize) => {
    const Customer = sequelize.define("customers", {
        fullname: {
            type: Sequelize.STRING, // VARCHAR(255)
            allowNull: true
        },
        phone: {
            type: Sequelize.BIGINT(11),
            allowNull: false,
            unique: true,
            validate: {
                is: /^(0)?9\d{9}$/i
            }
        }
    }, {
        underscored: true,
    })

    return Customer
}