'use strict'

// database instance
const db = require('../db')

// woocommerce helper
const WcHelpers = require('../helpers/wc.helpers')

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
async function insertProductToDB(product, businessId, parentId = null) {
	try {
		const [createdProduct] = await db.product.upsert({
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
		})
		let productMeta = getMeta(product, createdProduct.id)
		await db.productmeta.bulkCreate(productMeta, {
			updateOnDuplicate: ['metaValue']
		})
		let productImages = getImages(product, createdProduct.id)
		await db.productImage.bulkCreate(productImages, {
			updateOnDuplicate: ['src', 'name']
		})
		return createdProduct
	} catch(err) {
		console.log(`cannot insert product to DB, productId: ${product.id}`)
		console.log(err)
	}
}
async function create(req, res) {
	const wc = new WcHelpers(`https://${req.body.domain}`, req.body.key, req.body.secret)
	const checkedWC = await wc.check()
	if (!checkedWC) {
		console.log('Creating Business was failed.')
		return res.send({ success: false, message: 'The domain or keys are not correct.'})
	}
	const { success, products, variations } = await wc.getAllProducts()
	if (!success) {
		console.log('Creating Business was failed.')
		return res.send({ success: false, message: 'Cannot fetch products.'})
	}

	try {
		const business = await db.business.create({
			domain: req.body.domain,
			key: req.body.key,
			secret: req.body.secret,
			userId: req.user.id
		})

		await wc.createWebhooks(business.id, business.key)

		for (const product of products) {
			let createdProduct = await insertProductToDB(product, business.id)
			if (product.type === 'variable') {
				for (const id of product.variations) {
					const variation = variations.find(v => v.id === id)
					await insertProductToDB(variation, business.id, createdProduct.id)
				}
			}
		}

		return res.status(200).json({
			success: true,
			message: 'The products have loaded successfully.'
		})
	} catch(err) {
		console.log(err)
		return res.status(500).json({ success: false, message: err.message })
	}
}
async function check(req, res) {
	try {
		const business = await db.business.findOne({ where: { domain: req.body.domain } })
		let existed = false
		let message = 'The domain does not exist.'
		if (business) {
			existed = true
			message = 'The domain exist.'
		}
		res.status(200).json({ success: true, existed, message })
	} catch(err) {
		console.log(err.message)
		res.status(500).json({ status: 'failure', message: err.message })
	}
}

// export controller
module.exports = {
	create,
	check
}