'use strict'

// dependencies
const fs = require('fs/promises');
const path = require('path');

// database instance
const { Op } = require('sequelize');
const Business = require('../db/models/business');
const Product = require('../db/models/product');
const ProductMeta = require('../db/models/productmeta');
const ProductImage = require('../db/models/productImage');

// error handlers
const BaseErr = require('../errors/baseErr');
const httpStatusCodes = require('../errors/httpStatusCodes');

// helpers
const WcHelpers = require('../helpers/wc.helpers');
const { calculateDiscount, calculateSalePrice } = require('../helpers/product.helpers');
const Upload = require('../utils/upload');

// functions
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
async function getAll(req, res, next) {
	try {
		const business = await Business.findOne({ where: { userId: req.user.id }});
		if(!business) {
			throw new BaseErr(
				'BusinessDoesNotExist',
				httpStatusCodes.NOT_FOUND,
				true,
				`The user business not found.`
			);
		}

		// console.log(Object.keys(Business.prototype));

		const products = await business.getProducts({
			where: {
				type: {
					[Op.in]: ['simple', 'variation']
				},
				businessId: business.id
			},
			include: [
				{
					model: ProductMeta,
					as: 'meta'
				},
				{
					model: ProductImage,
					as: 'images',
					required: false
				}
			]
		});
		if(!products.length) {
			throw new BaseErr(
				'BusinessDoesNotHaveProducts',
				httpStatusCodes.NOT_FOUND,
				true,
				`There is not any products.`
			);
		}

		return res.status(200).json({
			success: true,
			message: 'The list of products found successfully.',
			data: products,
			domain: business.domain
		});

	} catch(e) {
		next(e);
	}
}
async function create(req, res, next) {
	try {
		req.body["salePrice"] = calculateSalePrice(req.body.price, req.body.discount);
		req.body["onlineSalePrice"] = calculateSalePrice(req.body.onlinePrice, req.body.onlineDiscount);

		const product = await Product.create(req.body);
		if(!product) {
			throw new BaseErr(
				'ProductNotCreated',
				httpStatusCodes.NOT_IMPLEMENTED,
				true,
				`The product has not been created successfully.`
			);
		}

		if (req.body.weight) {
			await ProductMeta.create({
				metaKey: 'weight',
				metaValue: req.body.weight,
				productId: product.id
			});
		}
		if (req.body.dimensions) {
			await ProductMeta.create({
				metaKey: 'dimensions',
				metaValue: JSON.stringify(req.body.dimensions),
				productId: product.id
			});
		}
		if (req.body.image?.length) {
			for (const img of req.body.image) {
				await ProductImage.create({
					src: img.src,
					name: img.name,
					productId: product.id
				});
			}
		}

		if (req.body.type === 'variable') {
			for (const variation of req.body.variations) {
				variation["salePrice"] = calculateSalePrice(variation.price, variation.discount);
				variation["onlineSalePrice"] = calculateSalePrice(variation.onlinePrice, variation.onlineDiscount);
				variation["parentId"] = product.id;

				const createdVariation = await Product.create(variation);
				if(!createdVariation) {
					throw new BaseErr(
						'VariationProductNotCreated',
						httpStatusCodes.NOT_IMPLEMENTED,
						true,
						`The variation product has not been created successfully.`
					);
				}

				if (variation.weight) {
					await ProductMeta.create({
						metaKey: 'weight',
						metaValue: variation.weight,
						productId: createdVariation.id
					});
				}
				if (variation.dimensions) {
					await ProductMeta.create({
						metaKey: 'dimensions',
						metaValue: JSON.stringify(variation.dimensions),
						productId: createdVariation.id
					});
				}
			}
		}

		return res.json({
			success: true,
			message: 'The products has been created successfully.',
			data: product
		});
	} catch(e) {
		next(e);
	}
}
async function edit(req, res, next) {
	try {
		const { price, discount, stock, onlinePrice, onlineDiscount, onlineStock, onlineSell } = req.body.fields;
		const business = await Business.findOne({ where: { userId: req.user.id }});
		if (!business) {
			throw new BaseErr(
				'BusinessNotFound',
				httpStatusCodes.NOT_FOUND,
				true,
				`The business does not exists.`
			);
		}

		const wc = new WcHelpers(`https://${business.domain}`, business.key, business.secret);

		let done = true;
		for (const id of req.body.ids) {

			const product = await Product.findByPk(id);
			if (product?.businessId !== business.id) continue;

			await product.update({ price, discount, stock, onlinePrice, onlineDiscount, onlineStock, onlineSell });
			await product.update({
				salePrice: Math.floor(product.price - (product.price * product.discount) / 100),
				onlineSalePrice: Math.floor(product.onlinePrice - (product.onlinePrice * product.onlineDiscount) / 100),
				onlineStock: onlineSell ? product.onlineStock : 0,
				infiniteStock: (stock !== undefined) ? false : product.infiniteStock
			});

			if (product.type === 'simple') {
				const updated = await wc.updateProduct({
					id: product.ref,
					onlinePrice: product.onlinePrice,
					onlineSalePrice: product.onlineSalePrice,
					onlineStock: product.onlineStock
				});
				if (!updated) {
					done = false;
					break;
				}
			}
			if (product.type === 'variation') {
				const parent = await Product.findByPk(product.parentId)
				const updated = await wc.updateProductVariation({
					id: product.ref,
					parentId: parent.ref,
					onlinePrice: product.onlinePrice,
					onlineSalePrice: product.onlineSalePrice,
					onlineStock: product.onlineStock
				});
				if (!updated) {
					done = false;
					break;
				}
			}
		}

		if (!done) {
			throw new BaseErr(
				'EditNotSuccessful',
				httpStatusCodes.NOT_IMPLEMENTED,
				true,
				`The products have NOT been updated successfully.`
			);
		}

		return res.json({
			success: true,
			message: 'The products have been updated successfully.'
		});

	} catch(e) {
		next(e);
	}
}
async function remove(req, res, next) {
	try {
		const business = await Business.findOne({ where: { userId: req.user.id }});
		if (!business) {
			throw new BaseErr(
				'BusinessNotFound',
				httpStatusCodes.NOT_FOUND,
				true,
				`The business does not exists.`
			);
		}

		const wc = new WcHelpers(`https://${business.domain}`, business.key, business.secret);
		let done = true;

		for (const id of req.body.ids) {
			const product = await Product.findByPk(id);
			if (product?.businessId !== business.id) continue;

			if (product.type === 'simple') {
				const updated = await wc.deleteProduct(product.ref);
				if (!updated) {
					done = false;
					break;
				}
			}
			if (product.type === 'variation') {
				const parent = await Product.findByPk(product.parentId);
				const updated = await wc.deleteProductVariation(product.ref, parent.ref);
				if (!updated) {
					done = false;
					break;
				}
			}
			await product.destroy();
		}

		if (!done) {
			throw new BaseErr(
				'DeleteNotSuccessful',
				httpStatusCodes.NOT_IMPLEMENTED,
				true,
				`The products have NOT been deleted successfully.`
			);
		}

		return res.json({
			success: true,
			message: 'The products have been deleted successfully.'
		});

	} catch(e) {
		next(e);
	}
}
async function upload(req, res, next) {
	try {
		const upload = new Upload('products');
		await upload.single(req, res, 'image');
		if (!req.file) {
			throw new BaseErr(
				'UploadFailed',
				httpStatusCodes.NOT_IMPLEMENTED,
				true,
				`The file didn't upload successfully.`
			);
		}

		const data = {
			name: req.file.filename,
			url: `/uploads/products/${req.file.filename}`
		}
		return res.send({ success: true, message: 'image uploaded.', data });

	} catch(e) {
		next(e);
	}
}

// handlers for webhooks action
/*
	both createWithWebhook and updateWithWebhook for variable products are the same,
	because in woocommerce it calls products.update webhook for a variable,
	after publish button has been clicked, the products.create webhook work for variables
 */
async function logWebhookResponse(webhook, body) {
	try {
		const date = new Date()
		const data = {
			date,
			webhook,
			body
		}
		await fs.appendFile(path.join(__dirname, `../logs/webhooks/product/${+date}.json`), JSON.stringify(data), 'utf-8')
	} catch(err) {
		console.log(err)
	}

}
async function createdWithWebhook(req, res, next) {
	try {
		await logWebhookResponse('products create', req.body)

		const { businessId, businessKey } = req.params
		const business = await Business.findByPk(businessId)
		if (business?.key !== businessKey) {
			return res.send({
				success: false,
				message: 'Your business key is not correct.'
			})
		}

		const product = {
			ref: req.body.id,
			name: req.body.name,
			barcode: req.body.sku,
			type: req.body.type,
			status: req.body.status,
			onlinePrice: req.body.regular_price || 0,
			onlineDiscount: calculateDiscount(req.body.regular_price, req.body.sale_price),
			onlineSalePrice: req.body.sale_price || 0,
			infiniteStock: !req.body.manage_stock,
			onlineStock: req.body.stock_quantity || 0,
			onlineSell: true,
			description: req.body.description,
			businessId
		}
		if (req.body.type === 'variation') {
			const parent = await Product.findOne({ where: { ref: req.body.parent_id, businessId } })
			product['parentId'] = parent.id
		}

		/*
			if there is some orphan variations
			if (req.body.type === 'variable') {
				const parent = await Product.upsert(products)
				for (const variation of req.body.variations) {
					const productVariation = await Product.findOne({ where: { ref: variation } })
					productVariation.update({ parentId: parent.id })
				}
			}
		*/
		const [createdProduct] = await Product.upsert(product)

		let productMeta = getMeta(req.body, createdProduct.id)
		await ProductMeta.bulkCreate(productMeta, {
			updateOnDuplicate: ['metaValue']
		})
		let productImages = getImages(req.body, createdProduct.id)
		await ProductImage.bulkCreate(productImages, {
			updateOnDuplicate: ['src', 'name']
		})

		return res.json({ success: false, message: 'The products has been created successfully. '})

	} catch(e) {
		next(e);
		// console.log('cannot create products through webhooks.')
		// console.log(err)
		// return res.send({
		// 	success: false,
		// 	message: 'cannot create products through webhooks.'
		// })
	}
}
async function updatedWithWebhook(req, res, next) {
	try {
		await logWebhookResponse('products update', req.body)

		const { businessId, businessKey } = req.params
		const business = await Business.findByPk(businessId)
		if (business?.key !== businessKey) {
			return res.send({
				success: false,
				message: 'Your business key is not correct.'
			})
		}

		const product = {
			ref: req.body.id,
			name: req.body.name,
			barcode: req.body.sku,
			type: req.body.type,
			status: req.body.status,
			onlinePrice: req.body.regular_price || 0,
			onlineDiscount: calculateDiscount(req.body.regular_price, req.body.sale_price),
			onlineSalePrice: req.body.sale_price || 0,
			infiniteStock: !req.body.manage_stock,
			onlineStock: req.body.stock_quantity,
			onlineSell: true,
			description: req.body.description,
			businessId
		}

		// if (req.body.type === 'variable') {
		// 	await Product.upsert(data)
		// } else {
		// 	const products = await Product.findOne({ where: { ref: req.body.id, businessId } })
		// 	if (!products) {
		// 		return res.send({
		// 			success: false,
		// 			message: 'this products not found.'
		// 		})
		// 	}
		// 	await products.update(data)
		// }

		const [updatedProduct] = await Product.upsert(product)

		let productMeta = getMeta(req.body, updatedProduct.id)
		await ProductMeta.bulkCreate(productMeta, {
			updateOnDuplicate: ['metaValue']
		})
		let productImages = getImages(req.body, updatedProduct.id)
		await ProductImage.bulkCreate(productImages, {
			updateOnDuplicate: ['src', 'name']
		})

		return res.json({ success: false, message: 'The products has been updated successfully. '})

	} catch(e) {
		next(e);
		// console.log('cannot update products through webhooks.')
		// console.log(err)
		// return res.send({
		// 	success: false,
		// 	message: 'cannot update products through webhooks.'
		// })
	}
}
async function deletedWithWebhook(req, res, next) {
	try {
		await logWebhookResponse('products delete', req.body)

		const { businessId, businessKey } = req.params
		const business = await Business.findByPk(businessId)
		if (business?.key !== businessKey) {
			return res.send({
				success: false,
				message: 'Your business key is not correct.'
			})
		}
		const product = await Product.findOne({ where: { ref: req.body.id, businessId } })
		if (!product) {
			return res.send({
				success: false,
				message: 'this products not found.'
			})
		}

		await product.destroy()
	} catch(e) {
		next(e);
		// console.log('cannot delete products through webhooks.')
		// console.log(err)
		// return res.send({
		// 	success: false,
		// 	message: 'cannot delete products through webhooks.'
		// })
	}
}

// export controller
module.exports = {
	getAll,
	create,
	edit,
	remove,
	upload,
	createdWithWebhook,
	updatedWithWebhook,
	deletedWithWebhook
}