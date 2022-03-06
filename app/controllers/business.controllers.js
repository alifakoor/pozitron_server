'use strict';

const Business = require('../db/models/business');
const Product = require('../db/models/product');
const ProductMeta = require('../db/models/productmeta');
const ProductImage = require('../db/models/productImage');
const Category = require("../db/models/category");
const Tag = require("../db/models/tag");
const Order = require('../db/models/order');
const OrderHasProducts = require('../db/models/orderHasProducts');

// woocommerce helper
const WcHelpers = require('../helpers/wc.helpers');

const BaseErr = require('../errors/baseErr');
const httpStatusCodes = require('../errors/httpStatusCodes');

function getMeta(wcProduct, productId) {
	let productMeta = []
	if (wcProduct.weight?.length) {
		productMeta.push({
			metaKey: 'weight',
			metaValue: wcProduct.weight,
			productId
		})
	}
	if (wcProduct.dimensions.length || wcProduct.dimensions.width || wcProduct.dimensions.height) {
		productMeta.push({
			metaKey: 'dimensions',
			metaValue: JSON.stringify(wcProduct.dimensions),
			productId
		})
	}
	if (wcProduct.attributes.length) {
		productMeta.push({
			metaKey: 'attributes',
			metaValue: JSON.stringify(wcProduct.attributes),
			productId
		})
	}
	if (wcProduct._links?.self) {
		productMeta.push({
			metaKey: 'links',
			metaValue: JSON.stringify(wcProduct._links.self),
			productId
		})
	}
	return productMeta
}
function getImages(wcProduct, productId) {
	let productImages = []
	if (wcProduct.images?.length) {
		for (const img of wcProduct.images) {
			productImages.push({
				src: img.src,
				name: img.name,
				productId
			})
		}
	}
	return productImages
}
async function insertProductToDB(product, businessId, parentId = null) {
	try {
		const [createdProduct] = await Product.upsert({
			ref: product.id,
			name: product.name,
			barcode: product.sku,
			type: product.type,
			status: product.status,
			onlinePrice: product.regular_price || 0,
			onlineDiscount: (product.regular_price && product.sale_price) ? Math.floor(((product.regular_price - product.sale_price) * 100) / product.regular_price) : 0,
			onlineSalePrice: product.sale_price || 0,
			infiniteStock: !product.manage_stock,
			onlineStock: product.stock_quantity || 0,
			onlineSell: true,
			description: product.description,
			businessId,
			parentId
		});

		let productMeta = getMeta(product, createdProduct.id);
		await ProductMeta.bulkCreate(productMeta, {
			updateOnDuplicate: ['metaValue']
		});

		let productImages = getImages(product, createdProduct.id);
		await ProductImage.bulkCreate(productImages, {
			updateOnDuplicate: ['src', 'name']
		});

		return createdProduct;

	} catch(e) {
		console.log(`cannot insert product to DB, productId: ${product.id}`);
		console.log(e);
	}
}
async function insertCategoryInDB(category, businessId, parentId = null) {
	try {
		return await Category.create({
			ref: category.id,
			name: category.name,
			slug: decodeURIComponent(category.slug),
			description: category.description,
			image: category.image?.src,
			count: category.count,
			link: JSON.stringify(category._links),
			businessId,
			parentId
		});

	} catch(e) {
		console.log(`cannot insert category to DB, categoryId: ${category.id}`);
		console.log(e);
	}
}

async function check(req, res, next) {
	try {
		const business = await Business.findOne({ where: { domain: req.body.domain } });
		let existed = false;
		let message = 'The domain does not exist.';
		if (business) {
			existed = true
			message = 'The domain exist.'
		}

		return res.json({ success: true, existed, message });
	} catch(e) {
		next(e);
	}
}
async function checkDomain(req, res, next) {
	try {
		const wc = new WcHelpers(`https://${req.body.domain}`, req.body.key, req.body.secret);
		const checkedWC = await wc.check();
		if (!checkedWC) {
			throw new BaseErr(
				'WoocommerceNotConnected',
				httpStatusCodes.NOT_ACCEPTABLE,
				true,
				`The domain or keys are not correct.`
			);
		}

		return res.send({ success: true, message: 'The domain and keys are correct.' })
	} catch(e) {
		next(e);
	}
}
async function create(req, res, next) {
	try {
		const existed = await Business.findOne({ where: { domain: req.body.domain }});
		if(existed) {
			throw new BaseErr(
				'DomainAlreadyExisted',
				httpStatusCodes.NOT_ACCEPTABLE,
				true,
				'The domain already existed.'
			);
		}

		const wc = new WcHelpers(`https://${req.body.domain}`, req.body.key, req.body.secret);

		const { success: isCategoriesLoaded, categories } = await wc.getAllCategories();
		if (!isCategoriesLoaded) {
			throw new BaseErr(
				'WoocommerceGetCategoryFailed',
				httpStatusCodes.NOT_ACCEPTABLE,
				true,
				`Cannot fetch categories`
			);
		}

		const { success: isTagsLoaded, tags } = await wc.getAllTags();
		if (!isTagsLoaded) {
			throw new BaseErr(
				'WoocommerceGetTagFailed',
				httpStatusCodes.NOT_ACCEPTABLE,
				true,
				`Cannot fetch tags`
			);
		}

		const { success: isProductLoaded, products, variations } = await wc.getAllProducts();
		if (!isProductLoaded) {
			throw new BaseErr(
				'WoocommerceGetProductFailed',
				httpStatusCodes.NOT_ACCEPTABLE,
				true,
				`Cannot fetch products.`
			);
		}

		const { success: isOrderLoaded, orders} = await wc.getAllOrders();
		if (!isOrderLoaded) {
			throw new BaseErr(
				'WoocommerceGetOrderFailed',
				httpStatusCodes.NOT_ACCEPTABLE,
				true,
				`Cannot fetch orders.`
			);
		}

		const business = await Business.create({
			domain: req.body.domain,
			key: req.body.key,
			secret: req.body.secret,
			userId: req.user.id
		});

		await wc.createWebhooks(business.id, business.key);

		for (const category of categories) {
			if (!!category.parent) {
				const newParent = await Category.findOne({ where: { ref: category.parent }});
				if (newParent) {
					const isCategoryExisted = await Category.findOne({ where: { ref: category.id }});
					if (!isCategoryExisted) {
						await insertCategoryInDB(category, business.id, newParent.id);
					} else {
						isCategoryExisted.parentId = newParent.id;
						await isCategoryExisted.save();
					}
				} else {
					const parent = categories.find(c => c.id === category.parent);
					const parentCreated = await insertCategoryInDB(parent, business.id);
					await insertCategoryInDB(category, business.id, parentCreated.id);
				}
			} else {
				await insertCategoryInDB(category, business.id);
			}
		}

		for (const tag of tags) {
			await Tag.create({
				ref: tag.id,
				name: tag.name,
				slug: decodeURIComponent(tag.slug),
				description: tag.description,
				count: tag.count,
				link: JSON.stringify(tag._links),
				businessId: business.id
			});
		}

		for (const product of products) {
			let createdProduct = await insertProductToDB(product, business.id);
			if (product.type === 'variable') {
				for (const id of product.variations) {
					const variation = variations.find(v => v.id === id);
					await insertProductToDB(variation, business.id, createdProduct.id);
				}
			}
		}

		for (const order of orders) {
			const createdOrder = await Order.create({
				ref: order.id,
				src: 'online',
				orderKey: order.order_key,
				status: order.status,
				currency: order.currency,
				discountTotal: order.discount_total ? Math.floor((order.discount_total * 100) / order.total) : 0,
				shippingTotal: order.shipping_total,
				totalPrice: order.total,
				totalTax: order.total_tax,
				businessId: business.id
			});
			for (const product of order.line_items) {

				let productRef = product.variation_id || product.product_id;
				let data = {
					name: product.name,
					price: product.price,
					quantity: product.quantity,
					total: +product.total,
					totalTax: +product.total_tax,
					orderId: createdOrder.id
				};

				if (productRef) {
					const existedProduct = await Product.findOne({ where: { ref: productRef }});
					data['productId'] = existedProduct.id;
				}

				await OrderHasProducts.create(data);
			}
		}

		return res.json({
			success: true,
			message: 'The categories, tags, products and orders have loaded successfully.'
		});

	} catch(e) {
		next(e);
	}
}

// export controller
module.exports = {
	create,
	check,
	checkDomain
}