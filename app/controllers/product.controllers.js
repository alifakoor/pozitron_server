'use strict'

// dependencies
const fs = require('fs/promises')
const path = require('path')

// database instance
const db = require('../db')

// helpers
const WcHelpers = require('../helpers/wc.helpers')
const { calculateDiscount, calculateSalePrice } = require('../helpers/product.helpers')

// functions
function getAll(req, res) {
	db.business
			.findOne({
				where: {
					userId: req.user.id
				}
			})
			.then(business => {
				if (business) {
					db.product
							.findAll({
								where: {
									type: {
										[db.Op.in]: ['simple', 'variation']
									},
									businessId: business.id
								},
								include: [
									{
										model: db.productmeta,
										as: 'meta'
									},
									{
										model: db.productImage,
										as: 'images',
										required: false
									}
								]
							})
							.then(products => {
								if (products.length) {
									res.status(200).json({
										success: true,
										message: 'The list of products found successfully.',
										data: products
									})
								} else {
									res.status(200).json({
										success: false,
										message: 'There is not any products.'
									})
								}

							})
							.catch(err => {
								console.log(err)
								res.status(400).send({ success: false, message: 'something wrong is happened in list of products.' })
							})
				} else {
					res.status(200).send({ success: false, message: 'user business not found.' })
				}
			})
			.catch(err => {
				console.log(err)
				res.status(500).send({ success: false, message: 'user business not found.' })
			})
}
async function create(req, res) {
	try {
		req.body["salePrice"] = calculateSalePrice(req.body.price, req.body.discount)
		req.body["onlineSalePrice"] = calculateSalePrice(req.body.onlinePrice, req.body.onlineDiscount)

		const product = await db.product.create(req.body)

		if (req.body.weight) {
			await db.productmeta.create({ metaKey: 'weight', metaValue: req.body.weight, productId: product.id })
		}
		if (req.body.dimensions) {
			await db.productmeta.create({ metaKey: 'dimensions', metaValue: JSON.stringify(req.body.dimensions), productId: product.id })
		}

		if (req.body.type === 'variable') {
			for (const variation of req.body.variations) {
				variation["salePrice"] = calculateSalePrice(variation.price, variation.discount)
				variation["onlineSalePrice"] = calculateSalePrice(variation.onlinePrice, variation.onlineDiscount)
				variation["parentId"] = product.id

				const createdVariation = await db.product.create(variation)

				if (variation.weight) {
					await db.productmeta.create({ metaKey: 'weight', metaValue: variation.weight, productId: createdVariation.id })
				}
				if (variation.dimensions) {
					await db.productmeta.create({ metaKey: 'dimensions', metaValue: JSON.stringify(variation.dimensions), productId: createdVariation.id })
				}
			}
		}

		return res.json({ success: true, message: 'The product has been created successfully.', data: product })
	} catch(err) {
		console.log(err)
		return res.json({ success: false, message: err.message })
	}
}
async function edit(req, res) {
	const { price, discount, stock, onlinePrice, onlineDiscount, onlineStock, onlineSell } = req.body.fields
	const business = await db.business.findOne({where: {userId: req.user.id}})
	if (!business) return res.json({ success: false, message: 'The business does not exist.' })

	const wc = new WcHelpers(`https://${business.domain}`, business.key, business.secret)

	let done = true
	for (const id of req.body.ids) {

		const product = await db.product.findByPk(id)
		if (product?.businessId !== business.id) continue

		await product.update({ price, discount, stock, onlinePrice, onlineDiscount, onlineStock, onlineSell })
		await product.update({
			salePrice: Math.floor(product.price - (product.price * product.discount) / 100),
			onlineSalePrice: Math.floor(product.onlinePrice - (product.onlinePrice * product.onlineDiscount) / 100),
			infiniteStock: (stock !== undefined) ? false : product.infiniteStock
		})

		if (product.type === 'simple') {
			const updated = await wc.updateProduct({
				id: product.ref,
				onlinePrice: product.onlinePrice,
				onlineSalePrice: product.onlineSalePrice,
				onlineStock: product.onlineStock
			})
			if (!updated) {
				done = false
				break
			}
		}
		if (product.type === 'variation') {
			const parent = await db.product.findByPk(product.parentId)
			const updated = await wc.updateProductVariation({
				id: product.ref,
				parentId: parent.ref,
				onlinePrice: product.onlinePrice,
				onlineSalePrice: product.onlineSalePrice,
				onlineStock: product.onlineStock
			})
			if (!updated) {
				done = false
				break
			}
		}
	}

	if (done) {
		return res.json({
			success: true,
			message: 'The products have been updated successfully.'
		})
	}
	return res.json({
		success: false,
		message: 'The products have NOT been updated successfully.'
	})
}
async function remove(req, res) {
	const business = await db.business.findOne({where: {userId: req.user.id}})
	if (!business) return res.json({ success: false, message: 'The business does not exist.' })

	const wc = new WcHelpers(`https://${business.domain}`, business.key, business.secret)
	let done = true

	for (const id of req.body.ids) {
		const product = await db.product.findByPk(id)
		if (product?.businessId !== business.id) continue

		if (product.type === 'simple') {
			const updated = await wc.deleteProduct(product.ref)
			if (!updated) {
				done = false
				break
			}
		}
		if (product.type === 'variation') {
			const parent = await db.product.findByPk(product.parentId)
			const updated = await wc.deleteProductVariation(product.ref, parent.ref)
			if (!updated) {
				done = false
				break
			}
		}
		await product.destroy()
	}

	if (done) {
		return res.json({
			success: true,
			message: 'The products have been deleted successfully.'
		})
	}
	return res.json({
		success: false,
		message: 'The products have NOT been deleted successfully.'
	})
}

// handlers for webhooks action
/*
	both createWithWebhook and updateWithWebhook for variable product are the same,
	because in woocommerce it calls product.update webhook for a variable,
	after publish button has been clicked, the product.create webhook work for variables
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
async function createdWithWebhook(req, res) {
	try {
		await logWebhookResponse('product create', req.body)

		const { businessId, businessKey } = req.params
		const business = await db.business.findByPk(businessId)
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
			description: req.body.description,
			businessId: business.id
		}
		if (req.body.type === 'variation') {
			const parent = await db.product.findOne({ where: { ref: req.body.parent_id } })
			product['parentId'] = parent.id
		}

		// if there is some orphan variations
		// if (req.body.type === 'variable') {
		// 	const parent = await db.product.upsert(product)
		// 	for (const variation of req.body.variations) {
		// 		const productVariation = await db.product.findOne({ where: { ref: variation } })
		// 		productVariation.update({ parentId: parent.id })
		// 	}
		// }
		await db.product.upsert(product)

	} catch(err) {
		console.log('cannot create product through webhooks.')
		console.log(err)
		return res.send({
			success: false,
			message: 'cannot create product through webhooks.'
		})
	}
}
async function updatedWithWebhook(req, res) {
	try {
		await logWebhookResponse('product update', req.body)

		const { businessId, businessKey } = req.params
		const business = await db.business.findByPk(businessId)
		if (business?.key !== businessKey) {
			return res.send({
				success: false,
				message: 'Your business key is not correct.'
			})
		}

		const data = {
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
			description: req.body.description,
			businessId: business.id
		}

		if (req.body.type === 'variable') {
			await db.product.upsert(data)
		} else {
			const product = await db.product.findOne({ where: { ref: req.body.id, businessId } })
			if (!product) {
				return res.send({
					success: false,
					message: 'this product not found.'
				})
			}
			await product.update(data)
		}

	} catch(err) {
		console.log('cannot update product through webhooks.')
		console.log(err)
		return res.send({
			success: false,
			message: 'cannot update product through webhooks.'
		})
	}
}
async function deletedWithWebhook(req, res) {
	try {
		await logWebhookResponse('product delete', req.body)

		const { businessId, businessKey } = req.params
		const business = await db.business.findByPk(businessId)
		if (business?.key !== businessKey) {
			return res.send({
				success: false,
				message: 'Your business key is not correct.'
			})
		}
		const product = await db.product.findOne({ where: { ref: req.body.id, businessId } })
		if (!product) {
			return res.send({
				success: false,
				message: 'this product not found.'
			})
		}

		await product.destroy()
	} catch(err) {
		console.log('cannot delete product through webhooks.')
		console.log(err)
		return res.send({
			success: false,
			message: 'cannot delete product through webhooks.'
		})
	}
}

// export controller
module.exports = {
	getAll,
	create,
	edit,
	remove,
	createdWithWebhook,
	updatedWithWebhook,
	deletedWithWebhook
}