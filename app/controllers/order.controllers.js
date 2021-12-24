'use strict'

// dependencies
const fs = require('fs/promises')
const path = require('path')

// database instance
const db = require('../db')

// helpers
const { calculateDiscount } = require('../helpers/product.helpers')

// functions

// handlers for webhooks action
async function logWebhookResponse(webhook, body) {
	try {
		const date = new Date()
		const data = {
			date,
			webhook,
			body
		}
		await fs.appendFile(path.join(__dirname, `../logs/webhooks/order/${+date}.json`), JSON.stringify(data), 'utf-8')
	} catch(err) {
		console.log(err)
	}

}
async function createdWithWebhook(req, res) {
	try {
		await logWebhookResponse('order create', req.body)

		const { businessId, businessKey } = req.params
		const business = await db.business.findByPk(businessId)
		if (business?.key !== businessKey) {
			return res.send({
				success: false,
				message: 'Your business key is not correct.'
			})
		}

		for(const item of req.body.line_items) {
			const product = await db.product.findOne({ where: { ref: item.product_id, businessId } })
			if (!product) return res.send({ success: false, message: 'this product not found.' })

			if (product.type === 'simple') {
				const onlineStock = product.onlineStock - item.quantity
				await product.update({ onlineStock })
			}
			if (product.type === 'variable') {
				const variation = await db.product.findOne({ where: { ref: item.variation_id, businessId } })
				const onlineStock = variation.onlineStock - item.quantity
				await variation.update({ onlineStock })
			}
		}

	} catch(err) {
		console.log('cannot create order through webhooks.')
		console.log(err)
		return res.send({
			success: false,
			message: 'cannot create order through webhooks.'
		})
	}
}
async function updatedWithWebhook(req, res) {
	try {
		await logWebhookResponse('order update', req.body)

		const { businessId, businessKey } = req.params
		const business = await db.business.findByPk(businessId)
		if (business?.key !== businessKey) {
			return res.send({
				success: false,
				message: 'Your business key is not correct.'
			})
		}

		for(const item of req.body.line_items) {
			const product = await db.product.findOne({ where: { ref: item.product_id, businessId } })
			if (!product) return res.send({ success: false, message: 'this product not found.' })

			if (product.type === 'simple') {
				const onlineStock = product.onlineStock - item.quantity
				await product.update({ onlineStock })
			}
			if (product.type === 'variable') {
				const variation = await db.product.findOne({ where: { ref: item.variation_id, businessId } })
				const onlineStock = variation.onlineStock - item.quantity
				await variation.update({ onlineStock })
			}
		}

	} catch(err) {
		console.log('cannot update order through webhooks.')
		console.log(err)
		return res.send({
			success: false,
			message: 'cannot update order through webhooks.'
		})
	}
}
async function deletedWithWebhook(req, res) {
	try {
		await logWebhookResponse('order delete', req.body)

		const { businessId, businessKey } = req.params
		const business = await db.business.findByPk(businessId)
		if (business?.key !== businessKey) {
			return res.send({
				success: false,
				message: 'Your business key is not correct.'
			})
		}

		for(const item of req.body.line_items) {
			const product = await db.product.findOne({ where: { ref: item.product_id, businessId } })
			if (!product) return res.send({ success: false, message: 'this product not found.' })

			if (product.type === 'simple') {
				const onlineStock = product.onlineStock + item.quantity
				await product.update({ onlineStock })
			}
			if (product.type === 'variable') {
				const variation = await db.product.findOne({ where: { ref: item.variation_id, businessId } })
				const onlineStock = variation.onlineStock + item.quantity
				await variation.update({ onlineStock })
			}
		}

	} catch(err) {
		console.log('cannot update order through webhooks.')
		console.log(err)
		return res.send({
			success: false,
			message: 'cannot update order through webhooks.'
		})
	}
}

// export controller
module.exports = {
	createdWithWebhook,
	updatedWithWebhook,
	deletedWithWebhook
}