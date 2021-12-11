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
    const [ createdProduct ] = await db.product.upsert({
        ref: product.id,
        name: product.name,
        barcode: product.sku,
        type: product.type,
        status: product.status,
        onlinePrice: product.price || 0,
        onlineSalePrice: product.sale_price || 0,
        infiniteStock: !product.manage_stock,
        onlineStock: product.stock_quantity,
        description: product.description,
        businessId,
        parentId
    })
    if (!createdProduct) {
        return false
    } else {
        let productMeta = getMeta(product, createdProduct.id)
        await db.productmeta.bulkCreate(productMeta, {
            updateOnDuplicate: ['metaValue']
        })
        let productImages = getImages(product, createdProduct.id)
        await db.productImage.bulkCreate(productImages, {
            updateOnDuplicate: ['src', 'name']
        })
        return createdProduct
    }
}
function create(req, res) {
    const wc = new WcHelpers(`https://${req.body.domain}`, req.body.key, req.body.secret)
    wc.check(checked => {
        if (checked) {
            db.business
                .create({
                    domain: req.body.domain,
                    key: req.body.key,
                    secret: req.body.secret,
                    userId: req.user.id
                })
                .then(async business => {
                    const { products, variations } = await wc.getAllProducts()
                    let done = true
                    for (const product of products) {
                        let createdProduct = await insertProductToDB(product, business.id)
                        if (!createdProduct) {
                            done = false
                            break
                        }
                        if (product.type === 'variable') {
                            for (const id of product.variations) {
                                const variation = variations.find(v => v.id === id)
                                let createdVariation = await insertProductToDB(variation, business.id, createdProduct.id)
                                if (!createdVariation) {
                                    done = false
                                    break
                                }
                            }
                        }
                        if (!done) break
                    }

                    if (done) {
                        res.status(200).json({
                            success: true,
                            message: 'The products have loaded successfully.'
                        })
                    } else {
                        res.status(200).json({
                            success: false,
                            message: 'The products have not loaded successfully.'
                        })
                    }
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).json({ success: false, message: err.message })
                })
        } else {
            res.status(200).json({ success: false, message: 'The domain or keys are not correct' })
        }
    })
}
function check(req, res) {
    db.business
        .findOne({
            where: {
                domain: req.params.domain
            }
        })
        .then(business => {
            let existed = false
            let message = 'The domain does not exist.'
            if (business) {
                existed = true
                message = 'The domain exist.'
            }
            res.status(200).json({ success: true, existed, message })
        })
        .catch(err => {
            console.log(err.message)
            res.status(500).json({ status: 'failure', message: err.message })
        })
}

// export controller
module.exports = {
    create,
    check
}