// Associations
const User = require("./models/user");
const Business = require("./models/business");
const Product = require("./models/product");
const Category = require("./models/category");
const Tag = require("./models/tag");
const ProductImage = require("./models/productImage");
const ProductMeta = require("./models/productmeta");

User.hasMany(Business);
Business.belongsTo(User);

Business.hasMany(Product);
Product.belongsTo(Business);

Business.hasMany(Category);
Category.belongsTo(Business);

Business.hasMany(Tag);
Tag.belongsTo(Business);

Product.hasMany(Product, {
	as: 'variations',
	foreignKey: 'parentId'
});

Product.hasMany(ProductImage, {
	as: 'images'
});
ProductImage.belongsTo(Product);
Product.hasMany(ProductMeta, {
	as: 'meta'
});
ProductMeta.belongsTo(Product);

Product.belongsToMany(Category, {
	through: 'product_has_categories',
	as: 'categories',
	onUpdate: 'CASCADE',
	onDelete: 'CASCADE'
});
Category.belongsToMany(Product, {
	through: 'product_has_categories',
	as: 'products',
	onUpdate: 'CASCADE',
	onDelete: 'CASCADE'
});

Category.hasMany(Category, {
	as: 'children',
	foreignKey: 'parentId'
});

Product.belongsToMany(Tag, {
	through: 'product_has_tags',
	as: 'tags',
	onUpdate: 'CASCADE',
	onDelete: 'CASCADE'
});
Tag.belongsToMany(Product, {
	through: 'product_has_tags',
	as: 'products',
	onUpdate: 'CASCADE',
	onDelete: 'CASCADE'
});