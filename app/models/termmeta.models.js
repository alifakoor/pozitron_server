module.exports = (sequelize, Sequelize) => {
    const Termmeta = sequelize.define("term_meta", {
        meta_key: {
            type: Sequelize.STRING // VARCHAR(255)
        },
        meta_value: {
            type: Sequelize.TEXT('long')
        }
    }, {
        underscored: true
    })

    return Termmeta
}