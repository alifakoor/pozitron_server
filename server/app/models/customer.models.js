module.exports = (sequelize, Sequelize) => {
    return sequelize.define("customers", {
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
        },
        email: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                isEmail: true,
            }
        }
    }, {
        underscored: true,
    })
}