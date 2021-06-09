module.exports = (sequelize, Sequelize) => {
    const TermRelation = sequelize.define("term_product_relation", {
        id: {
            type: Sequelize.BIGINT(20),
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        term_order: {
            type: Sequelize.BIGINT
        }
    }, {
        underscored: true,
    })

    return TermRelation
}