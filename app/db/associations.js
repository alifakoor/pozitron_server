// Associations
const User = require("./models/user");
const Business = require("./models/business");
const Product = require("./models/product");
const Category = require("./models/category");
const Tag = require("./models/tag");
const ProductImage = require("./models/productImage");
const ProductMeta = require("./models/productmeta");
const Order = require("./models/order");
const OrderHasProducts = require("./models/orderHasProducts");
const Customer = require("./models/customer");
const Address = require("./models/address");


User.hasMany(Business);
Business.belongsTo(User);

Business.hasMany(Product);
Product.belongsTo(Business);

Business.hasMany(Category);
Category.belongsTo(Business);

Business.hasMany(Tag);
Tag.belongsTo(Business);

Business.hasMany(Order);
Order.belongsTo(Business);

Business.hasMany(Customer);
Customer.belongsTo(Business);

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

Product.hasMany(OrderHasProducts, {
	as: 'orders'
});
OrderHasProducts.belongsTo(Product);

Order.hasMany(OrderHasProducts, {
	as: 'items'
});
OrderHasProducts.belongsTo(Order);

Customer.hasMany(Order);
Order.belongsTo(Customer, {
	foreignKey: {
		name: 'customerId',
		allowNull: true
	}
});

Customer.hasMany(Address);
Address.belongsTo(Customer);

Address.hasMany(Order);
Order.belongsTo(Address, {
	foreignKey: {
		name: 'addressId',
		allowNull: true
	}
});