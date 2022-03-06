'use strict'

// dependencies
const fs = require('fs/promises');
const path = require('path');

// models
const Business = require('../db/models/business');
const Product = require('../db/models/product');
const Order = require('../db/models/order');
const OrderHasProducts = require('../db/models/orderHasProducts');

// error handlers
const BaseErr = require('../errors/baseErr');
const httpStatusCodes = require('../errors/httpStatusCodes');

// helpers
const { calculateDiscount } = require('../helpers/product.helpers');
const {ORDER} = require("mysql/lib/PoolSelector");
const WcHelpers = require("../helpers/wc.helpers");

// functions
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

		const orders = await business.getOrders({
			where: {
				businessId: business.id
			},
			include: [
				{
					model: OrderHasProducts,
					as: 'items'
				}
			]
		});
		if(!orders.length) {
			throw new BaseErr(
				'BusinessDoesNotHaveOrders',
				httpStatusCodes.NOT_FOUND,
				true,
				`There is not any orders.`
			);
		}

		return res.status(200).json({
			success: true,
			message: 'The list of orders found successfully.',
			data: orders,
			domain: business.domain
		});

	} catch(e) {
		next(e);
	}
}
async function edit(req, res, next) {
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

		const order = await Order.findByPk(+req.params.id);
		if (!order) {
			throw new BaseErr(
				'OrderNotFound',
				httpStatusCodes.NOT_FOUND,
				true,
				`The order does not exists.`
			);
		}

		const { status } = req.body;
		const wc = new WcHelpers(`https://${business.domain}`, business.key, business.secret);

		await wc.updateOrder({ id: order.ref, status });

		order.status = status;
		await order.save();

		return res.json({
			success: true,
			message: 'The order have been updated successfully.'
		});

	} catch(e) {
		next(e);
	}
}

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
	getAll,
	edit,
	createdWithWebhook,
	updatedWithWebhook,
	deletedWithWebhook
}