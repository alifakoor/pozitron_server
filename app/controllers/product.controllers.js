'use strict'

// dependencies
const fs = require('fs/promises')
const path = require('path')

// database instance
const db = require('../db')

// woocommerce helper
const WcHelpers = require('../helpers/wc.helpers')

// product helper
const { calculateDiscount } = require('../helpers/product.helpers')

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
		product.destroy()
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
async function createdWithWebhook(req, res) {
	try {
		const date = new Date()
		await fs.writeFile(path.join(__dirname, `../logs/${date}.txt`), JSON.stringify(req.body), 'utf-8')
		const business = await db.business.findByPk(req.params.businessId)
		if (business?.key !== req.params.key) {
			return res.send({
				success: false,
				message: 'Your business key is not correct.'
			})
		}

		const product = {}
		if (req.body.type === 'simple') {
			product['ref'] = req.body.id
			product['name'] = req.body.name
			product['barcode'] = req.body.sku
			product['type'] = req.body.type
			product['status'] = req.body.status
			product['onlinePrice'] = req.body.regular_price || 0
			product['onlineDiscount'] = calculateDiscount(req.body.regular_price, req.body.sale_price)
			product['onlineSalePrice'] = req.body.sale_price || 0
			product['infiniteStock'] = !req.body.manage_stock
			product['onlineStock'] = req.body.stock_quantity || 0
			product['description'] = req.body.description
			product['business'] = req.params.businessId
		}
		if (req.body.type === 'variable') {

		}

		await db.product.create(product)

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
		const business = await db.business.findByPk(req.params.businessId)
		if (business?.key !== req.params.key) {
			return res.send({
				success: false,
				message: 'Your business key is not correct.'
			})
		}

	} catch(err) {
		console.log('cannot create product through webhooks.')
		console.log(err)
		return res.send({
			success: false,
			message: 'cannot create product through webhooks.'
		})
	}
}
async function deletedWithWebhook(req, res) {
	try {
		const business = await db.business.findByPk(req.params.businessId)
		if (business?.key !== req.params.key) {
			return res.send({
				success: false,
				message: 'Your business key is not correct.'
			})
		}

	} catch(err) {
		console.log('cannot create product through webhooks.')
		console.log(err)
		return res.send({
			success: false,
			message: 'cannot create product through webhooks.'
		})
	}
}

// export controller
module.exports = {
	getAll,
	edit,
	remove,
	createdWithWebhook,
	updatedWithWebhook,
	deletedWithWebhook
}