'use strict'

// dependencies
const fs = require('fs/promises');
const path = require('path');

// models
const Business = require('../db/models/business');
const Product = require('../db/models/product');

// error handlers
const BaseErr = require('../errors/baseErr');
const httpStatusCodes = require('../errors/httpStatusCodes');

// helpers
const { calculateDiscount } = require('../helpers/product.helpers');

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
async function createdWithWebhook(req, res, next) {
	try {
		await logWebhookResponse('order create', req.body);

		const { businessId, businessKey } = req.params;
		const business = await Business.findByPk(businessId);
		if (business?.key !== businessKey) {
			throw new BaseErr(
				'BusinessKeyIsNotCorrect',
				httpStatusCodes.NOT_ACCEPTABLE,
				true,
				'Your business key is not correct.'
			);
		}

		for(const item of req.body.line_items) {
			const product = await Product.findOne({ where: { ref: item.product_id, businessId } });
			if (!product) {
				throw new BaseErr(
					'ProductNotFound',
					httpStatusCodes.NOT_FOUND,
					true,
					'This product not found.'
				);
			}

			if (product.type === 'simple') {
				const onlineStock = product.onlineStock - item.quantity;
				await product.update({ onlineStock });
			}
			if (product.type === 'variable') {
				const variation = await Product.findOne({ where: { ref: item.variation_id, businessId } });
				const onlineStock = variation.onlineStock - item.quantity;
				await variation.update({ onlineStock });
			}
		}

	} catch(e) {
		console.log('cannot create order through webhooks.');
		next(e);
	}
}
async function updatedWithWebhook(req, res, next) {
	try {
		await logWebhookResponse('order update', req.body);

		const { businessId, businessKey } = req.params;
		const business = await Business.findByPk(businessId);
		if (business?.key !== businessKey) {
			throw new BaseErr(
				'BusinessKeyIsNotCorrect',
				httpStatusCodes.NOT_ACCEPTABLE,
				true,
				'Your business key is not correct.'
			);
		}

		for(const item of req.body.line_items) {
			const product = await Product.findOne({ where: { ref: item.product_id, businessId } });
			if (!product) {
				throw new BaseErr(
					'ProductNotFound',
					httpStatusCodes.NOT_FOUND,
					true,
					'This product not found.'
				);
			}

			if (product.type === 'simple') {
				const onlineStock = product.onlineStock - item.quantity;
				await product.update({ onlineStock });
			}
			if (product.type === 'variable') {
				const variation = await Product.findOne({ where: { ref: item.variation_id, businessId } });
				const onlineStock = variation.onlineStock - item.quantity;
				await variation.update({ onlineStock });
			}
		}

	} catch(e) {
		console.log('cannot update order through webhooks.')
		next(e);
	}
}
async function deletedWithWebhook(req, res, next) {
	try {
		await logWebhookResponse('order delete', req.body);

		const { businessId, businessKey } = req.params;
		const business = await Business.findByPk(businessId);
		if (business?.key !== businessKey) {
			throw new BaseErr(
				'BusinessKeyIsNotCorrect',
				httpStatusCodes.NOT_ACCEPTABLE,
				true,
				'Your business key is not correct.'
			);
		}

		for(const item of req.body.line_items) {
			const product = await Product.findOne({ where: { ref: item.product_id, businessId } });
			if (!product) {
				throw new BaseErr(
					'ProductNotFound',
					httpStatusCodes.NOT_FOUND,
					true,
					'This product not found.'
				);
			}

			if (product.type === 'simple') {
				const onlineStock = product.onlineStock + item.quantity;
				await product.update({ onlineStock });
			}
			if (product.type === 'variable') {
				const variation = await Product.findOne({ where: { ref: item.variation_id, businessId } });
				const onlineStock = variation.onlineStock + item.quantity;
				await variation.update({ onlineStock });
			}
		}

	} catch(e) {
		console.log('cannot update order through webhooks.');
		next(e);
	}
}

// export controller
module.exports = {
	createdWithWebhook,
	updatedWithWebhook,
	deletedWithWebhook
}