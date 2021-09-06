const config = require("../config/db.config.js")

const Sequelize = require("sequelize")
const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASS,
    {
        host: config.HOST,
        dialect: config.dialect,
        pool: {
            max: config.pool.max,
            min: config.pool.min,
            acquire: config.pool.acquire,
            idle: config.pool.idle
        }
    }
)

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

// models
db.user          = require("./user.models.js")(sequelize, Sequelize)
db.usermeta      = require("./usermeta.models.js")(sequelize, Sequelize)
db.business      = require("./business.models.js")(sequelize, Sequelize)
db.customer      = require("./customer.models.js")(sequelize, Sequelize)
// db.customermeta  = require("./customermeta.models.js")(sequelize, Sequelize)
db.product       = require("./product.models.js")(sequelize, Sequelize)
db.productmeta   = require("./productmeta.models.js")(sequelize, Sequelize)
db.term          = require("./terms.models.js")(sequelize, Sequelize)
db.termmeta      = require("./termmeta.models.js")(sequelize, Sequelize)
db.termRelation  = require("./termRelation.models.js")(sequelize, Sequelize)
db.order         = require("./order.models.js")(sequelize, Sequelize)
db.ordermeta     = require("./ordermeta.models.js")(sequelize, Sequelize)
db.orderItems    = require("./orderItems.models.js")(sequelize, Sequelize)
db.orderItemmeta = require("./orderItemmeta.models.js")(sequelize, Sequelize)
db.address       = require("./address.models")(sequelize, Sequelize)

// association user & usermeta models
db.user.hasMany(db.usermeta)
db.usermeta.belongsTo(db.user)

// association customers & customermeta models
// db.customer.hasMany(db.customermeta)
// db.customermeta.belongsTo(db.customer)

// association product & productmeta models
db.product.hasMany(db.product, {
    as: 'children',
    foreignKey: 'parent_id'
})
db.product.hasMany(db.productmeta)
db.productmeta.belongsTo(db.product)

// association term & termmeta models
db.term.hasMany(db.term, {
    as: 'children',
    foreignKey: 'parent_id'
})
db.term.hasMany(db.termmeta)
db.termmeta.belongsTo(db.term)

// association order & order meta models
db.order.hasMany(db.ordermeta)
db.ordermeta.belongsTo(db.order)

// association orderItems & orderItemmeta models
db.orderItems.hasMany(db.orderItemmeta)
db.orderItemmeta.belongsTo(db.orderItems)

// association users & customers models
db.user.hasMany(db.customer)
db.customer.belongsTo(db.user)

// association users & orders models
db.user.hasMany(db.order)
db.order.belongsTo(db.user)

// association users & business models
db.business.hasMany(db.user)
db.user.belongsTo(db.business)

// association business & products models
db.business.hasMany(db.product)
db.product.belongsTo(db.business)

// association business & terms models
db.business.hasMany(db.term)
db.term.belongsTo(db.business)

// association customers & orders models
db.customer.hasMany(db.order)
db.order.belongsTo(db.customer)

// association term & product models
db.product.belongsToMany(db.term, { through: db.termRelation })
db.term.belongsToMany(db.product, { through: db.termRelation })

// association product & orders models
db.product.belongsToMany(db.order, { as: 'order', through: db.orderItems })
db.order.belongsToMany(db.product, { as: 'items', through: db.orderItems })

// association customer & address models
db.customer.hasMany(db.address)
db.address.belongsTo(db.customer)

// association order & address models
db.address.hasMany(db.order)
db.order.belongsTo(db.address)

module.exports = db