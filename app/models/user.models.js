module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
        username: {
            type: Sequelize.STRING(50), // VARCHAR(50)
            allowNull: false,
            unique: true,
            validate: {
                is: ["^[a-zA-Z0-9]+$", 'i'],
                len: [3, 50]
            }
        },
        password: {
            type: Sequelize.STRING(150),
            allowNull: false,
            validate: {
                len: [8, 150]
            }
        },
        fullname: {
            type: Sequelize.STRING, // VARCHAR(255)
            allowNull: true,
            validate: {
                is: ["^[a-zA-Z ]+$", 'i']
            }
        },
        email: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                isEmail: true,
            }
        },
        phone: {
            type: Sequelize.BIGINT(11),
            allowNull: false,
            unique: true,
            validate: {
                is: /^(0)?9\d{9}$/i
            }
        },
        kind: {
            type: Sequelize.STRING(20),
            validate: {
                isIn: [[
                    "unknown",
                    "user",
                    "admin"
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
        }
    }, {
        underscored: true,
    })

    return User
}