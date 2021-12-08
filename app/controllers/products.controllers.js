/**
 * Requirements
 */
const _ = require('lodash')

/**
 * Models
 */
const db = require("../models")
// const db = require("../db/auth.index.js")
const Op = db.Sequelize.Op
const PRODUCT = db.product
const PRODUCT_META = db.productmeta
const TERM = db.term
const TermMeta = db.termmeta
const TERM_RELATION = db.termRelation

const winston = require('winston')
winston.configure({
    transports: [
        new (winston.transports.File)({ filename: 'app/logs/somefile.log' })
    ]
})
// winston.log('info', 'Now my debug messages are written to console!')

/** Woocommerce Rest API **/
// const wc_api = require('../db/wc.db')
// const Woocommerce = require("@woocommerce/woocommerce-rest-api").default

const getSpecialMetaData = function (metadata, key = []) {
    const result = {}
    for (let i = 0; i < metadata.length; i++) {
        if (key.includes(metadata[i].meta_key)) {
            result[metadata[i].meta_key] = metadata[i].meta_value
        }
    }
    return result
}

const getNameOfAttribute = function (items, value) {
    const option = items.find(item => {
        return item.value === value
    })
    return option.text
}

const handleItemVariationTitle = function (item) {
    const result = item.options.find((option) => {
        return option.value === item.selected
    })
    return result.text
}

const createBulkData = function (keys, data) {
    let bulk = []
}

// uncategorized category id for product that hasn't any categories
function uncategorizedCategory () {
    return TERM.findOne({
        where: {
            slug: 'uncategorized'
        }
    }).then(uncategorized => { return uncategorized.id }
    ).catch(err => console.log(`uncategorized category not found, ${err}`))
}

// return all product's category's id
function manageProductCategories (product_id, categories) {
    return TERM_RELATION.findAll({
        where: {
            productId: product_id,
        },
        attributes: ['term_id']
    }).then(terms => {
        let exist_ids = []
        terms.map((term) => {
            let term_id = term.dataValues.term_id
            exist_ids.push(term_id)
            if (!categories.includes(term_id)) {
                TERM_RELATION.destroy({
                    where: {
                        productId: product_id,
                        termId: term_id
                    }
                })
            }
        })
        categories.map((cat) => {
            if (!exist_ids.includes(cat)) {
                TERM_RELATION.upsert({
                    term_order: 1,
                    productId: product_id,
                    termId: cat
                })
            }
        })
    }).catch(err => console.log(`product's terms not founded, error: ${err}`))
}

async function createTags (tags) {
    let ids = []
    for (const tag of tags) {
        await TERM.upsert({
            name: tag,
            slug: tag.replace(/\s/g, '-'),
            type: 'tag',
            status: 'active'
        }).then((createdTag) => {
            createdTag = createdTag[0]
            ids.push(createdTag.dataValues.id)
        }).catch(err => console.log(`tag wasn't created, error: ${err}`))
    }
    return ids
}

function manageVariableProductVariations (variable, variableId, business) {
    variable.variations.items.forEach(variation => {
        PRODUCT.upsert({
            title: variable.name + ' - ' + handleItemVariationTitle(variation),
            slug: variation.barcode,
            barcode: variation.barcode,
            type: 'product_variation',
            status: 'publish',
            parent_id: variableId,
            business_id: business
        }).then(
            (importedChild) => {
                importedChild = importedChild[0]
                console.log(`create product's variations was successful.`)
                return PRODUCT_META.bulkCreate([
                    {
                        meta_key: '_attributes',
                        meta_value: JSON.stringify({ name: variable.attributes.name, option: variation.selected, text: getNameOfAttribute(variation.options, variation.selected)}),
                        productId: importedChild.dataValues.id
                    },
                    {
                        meta_key: '_stock',
                        meta_value: JSON.stringify(variation.stock),
                        productId: importedChild.dataValues.id
                    },
                    {
                        meta_key: '_price',
                        meta_value: '0',
                        productId: importedChild.dataValues.id
                    },
                    {
                        meta_key: '_discount',
                        meta_value: JSON.stringify(variation.discount),
                        productId: importedChild.dataValues.id
                    },
                    {
                        meta_key: '_dimensions',
                        meta_value: JSON.stringify(variation.size),
                        productId: importedChild.dataValues.id
                    },
                    {
                        meta_key: '_weight',
                        meta_value: '0',
                        productId: importedChild.dataValues.id
                    },
                    {
                        meta_key: '_online_sell',
                        meta_value: false,
                        productId: importedChild.dataValues.id
                    },
                    {
                        meta_key: '_online_price',
                        meta_value: '0',
                        productId: importedChild.dataValues.id
                    },
                    {
                        meta_key: '_online_stock',
                        meta_value: '0',
                        productId: importedChild.dataValues.id
                    },
                    {
                        meta_key: '_online_discount',
                        meta_value: JSON.stringify(variation.online_discount),
                        productId: importedChild.dataValues.id
                    },
                    {
                        meta_key: '_links',
                        meta_value: null,
                        productId: importedChild.dataValues.id
                    },
                    {
                        meta_key: '_images',
                        meta_value: '[]',
                        productId: importedChild.dataValues.id
                    }
                ],{
                    updateOnDuplicate: ['meta_value']
                }).then(() => console.log(`product meta for child creation was successful.`))
                    .catch(err => console.log(`product meta for child creation failed, ${err}`))
            }
        ).catch(err => console.log(`create product's variation failed, ${err}`))
    })
}

function createSimpleProduct(product, business) {
    return PRODUCT.upsert({
        title: product.name,
        description: product.description,
        slug: product.barcode,
        barcode: product.barcode,
        type: 'simple',
        status: 'publish',
        business_id: business
    },{
        returning: true
    }).then(
        (importResult) => {
            importResult = importResult[0]
            // import meta data of products
            return PRODUCT_META.bulkCreate([
                {
                    meta_key: '_attributes',
                    meta_value: '[]',
                    productId: importResult.dataValues.id
                },
                {
                    meta_key: '_price',
                    meta_value: product.price,
                    productId: importResult.dataValues.id
                },
                {
                    meta_key: '_discount',
                    meta_value: JSON.stringify(product.discount),
                    productId: importResult.dataValues.id
                },
                {
                    meta_key: '_stock',
                    meta_value: JSON.stringify(product.stock),
                    productId: importResult.dataValues.id
                },
                {
                    meta_key: '_dimensions',
                    meta_value: JSON.stringify(product.size),
                    productId: importResult.dataValues.id
                },
                {
                    meta_key: '_weight',
                    meta_value: product.weight,
                    productId: importResult.dataValues.id
                },
                {
                    meta_key: '_online_sell',
                    meta_value: product.online_sell,
                    productId: importResult.dataValues.id
                },
                {
                    meta_key: '_online_price',
                    meta_value: product.online_price,
                    productId: importResult.dataValues.id
                },
                {
                    meta_key: '_online_discount',
                    meta_value: JSON.stringify(product.online_discount),
                    productId: importResult.dataValues.id
                },
                {
                    meta_key: '_online_stock',
                    meta_value: product.online_stock,
                    productId: importResult.dataValues.id
                },
                {
                    meta_key: '_links',
                    meta_value: (product.permalink !== null) ? product.permalink : null,
                    productId: importResult.dataValues.id
                },
                {
                    meta_key: '_images',
                    meta_value: JSON.stringify(product.images),
                    productId: importResult.dataValues.id
                }
            ], {
                updateOnDuplicate: ['meta_value']
            }).then(
                async () => {
                    if (product.categories.length === 0) {
                        product.categories.push(await uncategorizedCategory())
                    }

                    if (product.tags.length > 0) {
                        let tags = await createTags(product.tags)
                        product.categories.push(...tags)
                    }
                    await manageProductCategories(importResult.dataValues.id, product.categories)

                    return importResult.dataValues
                }
            ).catch(err => console.log(`create product meta failed with err: ${err}`))
        }
    ).catch(err => { return `create product failed, ${err}` })
}

function createVariableProduct(product, business) {
    return PRODUCT.upsert({
        title: product.name,
        description: product.description,
        slug: product.barcode,
        barcode: product.barcode,
        type: 'variable',
        status: 'publish',
        businessId: business
    }).then(
        (importResult) => {
            importResult = importResult[0]
            // import meta data of products
            PRODUCT_META.bulkCreate([
                {
                    meta_key: '_attributes',
                    meta_value: JSON.stringify(product.attributes),
                    productId: importResult.dataValues.id
                },
                {
                    meta_key: '_links',
                    meta_value: product.permalink,
                    productId: importResult.dataValues.id
                },
                {
                    meta_key: '_images',
                    meta_value: JSON.stringify(product.images),
                    productId: importResult.dataValues.id
                }
            ], {
                updateOnDuplicate: ['meta_value']
            }).then(() => {console.log(`product meta imported.`)}
            ).catch(err => console.log(`create product meta failed, ${err}`))
            return importResult
        }
    ).then(
        async (importResult) => {
            if (product.categories.length === 0) {
                product.categories.push(await uncategorizedCategory())
            }

            if (product.tags.length > 0) {
                let tags = await createTags(product.tags)
                product.categories.push(...tags)
            }

            await manageProductCategories(importResult.dataValues.id, product.categories)

            await manageVariableProductVariations(product, importResult.dataValues.id, business)

            return importResult
        }
    ).then((importResult) => { return importResult })
        .catch(err => console.log(`create product failed, ${err}`))
}

function editVariation(product) {
    return PRODUCT.upsert({
        title: product.name,
        slug: product.barcode,
        barcode: product.barcode,
        type: 'product_variation',
        status: 'publish'
    },{
        returning: true
    }).then(
        (importResult) => {
            importResult = importResult[0]
            // import meta data of products
            return PRODUCT_META.bulkCreate([
                {
                    meta_key: '_price',
                    meta_value: product.price,
                    productId: importResult.dataValues.id
                },
                {
                    meta_key: '_discount',
                    meta_value: JSON.stringify(product.discount),
                    productId: importResult.dataValues.id
                },
                {
                    meta_key: '_stock',
                    meta_value: JSON.stringify(product.stock),
                    productId: importResult.dataValues.id
                },
                {
                    meta_key: '_dimensions',
                    meta_value: JSON.stringify(product.size),
                    productId: importResult.dataValues.id
                },
                {
                    meta_key: '_weight',
                    meta_value: product.weight,
                    productId: importResult.dataValues.id
                },
                {
                    meta_key: '_online_sell',
                    meta_value: product.online_sell,
                    productId: importResult.dataValues.id
                },
                {
                    meta_key: '_online_price',
                    meta_value: product.online_price,
                    productId: importResult.dataValues.id
                },
                {
                    meta_key: '_online_discount',
                    meta_value: JSON.stringify(product.online_discount),
                    productId: importResult.dataValues.id
                },
                {
                    meta_key: '_online_stock',
                    meta_value: product.online_stock,
                    productId: importResult.dataValues.id
                },
                {
                    meta_key: '_links',
                    meta_value: (product.permalink !== null) ? product.permalink : null,
                    productId: importResult.dataValues.id
                },
                {
                    meta_key: '_images',
                    meta_value: JSON.stringify(product.images),
                    productId: importResult.dataValues.id
                }
            ], {
                updateOnDuplicate: ['meta_value']
            }).then(() => {
                    return importResult.dataValues
                }
            ).catch(err => console.log(`create product meta failed with err: ${err}`))
        }
    ).catch(err => { return `create product failed, ${err}` })
}

exports.products = (req, res) => {
    // list of all products
    PRODUCT.findAll({
        where: {
            type: {
                [Op.in]: ['simple', 'variable']
            },
            business_id: req.business
        },
        include: [
            {
                model: PRODUCT,
                as: 'children',
                include: [{ model: PRODUCT_META }]
            },
            {
                model: PRODUCT_META,
                attributes: ['meta_key', 'meta_value']
            },
            {
                model: TERM,
                attributes: ['id', 'name', 'type'],
                required: false
            }
        ],
        order: [
            [
                { model: PRODUCT, as: 'children' },
                'id',
                'ASC'
            ]
        ]
    }).then(products => {
        products.forEach(product => {
            product.dataValues.product_meta = _.chain(product.product_meta).keyBy('meta_key').mapValues('meta_value').value()
            if (product.children.length) {
                product.children.forEach(child => {
                    child.dataValues.product_meta = _.chain(child.product_meta).keyBy('meta_key').mapValues('meta_value').value()
                })
            }
        })
        res.status(200).send(products)
    }).catch((err) => {
        console.log(`all products not found with err: ${err}`)
    }).finally(() => {})
}

exports.syncProducts = async (req, res) => {

    // list of all categories
    let result = []
    let page = 0
    let total_page = 0

    // get all categories, there is a pagination in wc api
    // so i use a doWhile loop for fetch all data in one array
    do  {
        await wc_api.get("products", { page: ++page, per_page: 100, orderby: 'id' }).then(response => {
            total_page = parseInt(response.headers['x-wp-totalpages'])
            for (let i = 0; i < response.data.length; i++) {
                response.data[i].slug = decodeURIComponent(response.data[i].slug)
                response.data[i].permalink = decodeURIComponent(response.data[i].permalink)
            }
            result = result.concat(response.data)
        }).catch((err) => {
            console.log("Response Status:", err.response.status)
            console.log("Response Headers:", err.response.headers)
            console.log("Response Data:", err.response.data)
        }).finally(() => {})
    } while (page < total_page)

    // create products in database and update parents
    result.forEach(data => {
        // import products
        Product.create({
            title: data.name,
            description: data.description,
            slug: data.slug,
            barcode: data.sku,
            type: data.type,
            status: data.status
        }).then((importResult) => {
            // import meta data of products
            PRODUCT_META.bulkCreate([
                {
                    meta_key: '_wc_id',
                    meta_value: data.id,
                    productId: importResult.dataValues.id
                },
                {
                    meta_key: '_wc_attributes',
                    meta_value: JSON.stringify(data.attributes),
                    productId: importResult.dataValues.id
                },
                {
                    meta_key: '_wc_default_attributes',
                    meta_value: JSON.stringify(data.default_attributes),
                    productId: importResult.dataValues.id
                },
                {
                    meta_key: '_wc_dimensions',
                    meta_value: JSON.stringify(data.dimensions),
                    productId: importResult.dataValues.id
                },
                {
                    meta_key: '_wc_images',
                    meta_value: JSON.stringify(data.images),
                    productId: importResult.dataValues.id
                },
                {
                    meta_key: '_wc_permalink',
                    meta_value: data.permalink,
                    productId: importResult.dataValues.id
                },
                {
                    meta_key: '_wc_price',
                    meta_value: data.price,
                    productId: importResult.dataValues.id
                },
                {
                    meta_key: '_wc_stock_quantity',
                    meta_value: data.stock_quantity,
                    productId: importResult.dataValues.id
                },
                {
                    meta_key: '_wc_stock_status',
                    meta_value: data.stock_status,
                    productId: importResult.dataValues.id
                },
                {
                    meta_key: '_wc_weight',
                    meta_value: data.weight,
                    productId: importResult.dataValues.id
                },
                {
                    meta_key: '_wc_links',
                    meta_value: JSON.stringify(data._links),
                    productId: importResult.dataValues.id
                }
            ]).then(() => {
                console.log(`product meta imported.`)
                data.categories.forEach(category => {
                    TERM_META.findOne({
                        where: { meta_key: '_wc_id', meta_value: category.id }
                    }).then((onp_category) => {
                        TERM_RELATION.create({
                            term_order: 1,
                            productId: importResult.dataValues.id,
                            termId: onp_category.termId
                        }).then(() => {
                            console.log(`create product's category was successful.`)
                        }).catch((err) => {
                            console.log(`create product's category failed with err: ${err}`)
                        })
                    }).catch((err) => { console.log(`not found product meta ${err}`) })
                })
            }).catch((err) => {
                console.log(`create product meta failed with err: ${err}`)
            })
        }).catch((err) => {
            console.log(`create product failed with err: ${err}`)
        })
    })

    res.status(200).send({
        status: 200,
        message: 'sync was successful. enjoy!'
    })
}

exports.syncVariableProducts = (req, res) => {
    Product.findAll({
        where: {
            type: 'variable'
        },
        include: PRODUCT_META
    }).then((all) => {
        all.forEach(async (product) => {
            let meta_data = product.product_meta.find((meta) => {
                if (meta.meta_key === '_wc_id') {
                    return meta.meta_value
                }
            })
            let result = []
            let page = 0
            let total_page = 0

            // get all categories, there is a pagination in wc api
            // so i use a doWhile loop for fetch all data in one array
            do  {
                await wc_api.get("products/"+meta_data.meta_value+"/variations", { page: ++page, per_page: 100, orderby: 'id' }).then(response => {
                    total_page = parseInt(response.headers['x-wp-totalpages'])
                    for (let i = 0; i < response.data.length; i++) {
                        response.data[i].slug = decodeURIComponent(response.data[i].slug)
                        response.data[i].permalink = decodeURIComponent(response.data[i].permalink)
                    }
                    result = result.concat(response.data)
                }).catch((err) => {
                    console.log("Response Status:", err.response.status)
                    console.log("Response Headers:", err.response.headers)
                    console.log("Response Data:", err.response.data)
                }).finally(() => {})
            } while (page < total_page)

            // create products in database and update parents
            result.forEach((data) => {
                // import products
                // console.log(product.id, typeof product.id)

                Product.create({
                    title: product.title + ' - ' + data.attributes[0].option,
                    description: data.description,
                    slug: (data.slug !== 'undefined') ? data.slug : data.sku,
                    sku: data.sku,
                    type: 'product_variation',
                    status: data.status,
                    parent_id: product.id
                }).then((importResult) => {
                    // import meta data of products
                    if (importResult.dataValues.id)
                    PRODUCT_META.bulkCreate([
                        {
                            meta_key: '_wc_id',
                            meta_value: data.id,
                            productId: importResult.dataValues.id
                        },
                        {
                            meta_key: '_wc_attributes',
                            meta_value: JSON.stringify(data.attributes),
                            productId: importResult.dataValues.id
                        },
                        {
                            meta_key: '_wc_default_attributes',
                            meta_value: JSON.stringify(data.default_attributes),
                            productId: importResult.dataValues.id
                        },
                        {
                            meta_key: '_wc_dimensions',
                            meta_value: JSON.stringify(data.dimensions),
                            productId: importResult.dataValues.id
                        },
                        {
                            meta_key: '_wc_images',
                            meta_value: JSON.stringify(data.images),
                            productId: importResult.dataValues.id
                        },
                        {
                            meta_key: '_wc_permalink',
                            meta_value: data.permalink,
                            productId: importResult.dataValues.id
                        },
                        {
                            meta_key: '_wc_price',
                            meta_value: data.price,
                            productId: importResult.dataValues.id
                        },
                        {
                            meta_key: '_wc_stock_quantity',
                            meta_value: data.stock_quantity,
                            productId: importResult.dataValues.id
                        },
                        {
                            meta_key: '_wc_stock_status',
                            meta_value: data.stock_status,
                            productId: importResult.dataValues.id
                        },
                        {
                            meta_key: '_wc_weight',
                            meta_value: data.weight,
                            productId: importResult.dataValues.id
                        },
                        {
                            meta_key: '_wc_links',
                            meta_value: JSON.stringify(data._links),
                            productId: importResult.dataValues.id
                        }
                    ]).then(() => {
                        console.log(`product meta imported.`)
                    }).catch((err) => {
                        console.log(`create product meta failed with err: ${err}`)
                    })
                }).catch((err) => {
                    console.log(`create product failed with err: ${err}`)
                })

            })

        })
    }).catch(err => {
        console.log(err)
    })
}

exports.getAllProductsForCart = async (req, res) => {
    // get productmeta's stock > 0
    let product_meta = await PRODUCT_META.findAll({
        attributes: ['product_id'],
        where: {
            meta_key: '_stock',
            [Op.or] : [
                { meta_value: { [Op.like]: '%"selected":"infinity"%' }},
                { meta_value: { [Op.notLike]: '%"value":0%' }}
            ]
        }
    })
    products_ids = []
    product_meta.forEach((meta) => {
        products_ids.push(meta.dataValues.product_id)
    })
    // list of all products
    Product.findAll({
        where: {
            id: {
                [Op.in]: products_ids
            }
        },
        include: [
            {
                model: PRODUCT_META
            },
            {
                model: TERM
            }
        ]
    }).then(products => {
        res.status(200).send(products)
    }).catch((err) => {
        console.log(`all products not found with err: ${err}`)
    }).finally(() => {})
}

exports.manageStock = (req, res) => {
    // find product
    Product.findOne({
        where: {
            id: req.body.id
        },
        include: [
            {
                model: PRODUCT_META,
                attributes: ['meta_key', 'meta_value'],
                as: 'metadata',
                where: {
                    meta_key:{
                        [Op.or]: ['_wc_stock_quantity', '_wc_id']
                    }
                }
            }
        ]
    }).then((product) => {
        const metadata = getSpecialMetaData(product.metadata, ['_wc_id', '_wc_stock_quantity'])
        product.dataValues.metadata = metadata
        console.log(product, typeof product)
        res.status(200).send(product)
    }).catch((err) => { console.log(`find product failed with err: ${err}`) })
}

exports.uploadImage = (req, res) => {
    console.log(req)
}

exports.createNewProduct = async (req, res) => {
    if (req.body.type === 'simple' || req.body.type === 'editSimple') {
        try {
            const product = await createSimpleProduct(req.body.simple, req.business)
            Product.findOne({
                where: {
                    id: product.id
                },
                include: [
                    {
                        model: PRODUCT_META,
                        attributes: ['meta_key', 'meta_value']
                    },
                    {
                        model: TERM,
                        required: false
                    }
                ]
            })
                .then(founded => {
                    founded.dataValues.product_meta = _.chain(founded.product_meta).keyBy('meta_key').mapValues('meta_value').value()
                    res.status(200).send(founded)
                })
                .catch(err => console.log(`product with id: ${product.id} not found with err: ${err}`))
        } catch {
            res.status(404).send({
                success: false,
                message: 'An error happened, please try again.'
            })
        }
    } else if (req.body.type === 'variable' || req.body.type === 'editVariable') {
        try {
            const product = await createVariableProduct(req.body.variable, req.business)

            res.status(200).send({
                success: true,
                message: 'product created.',
                data: product
            })
        } catch {
            res.status(404).send({
                success: false,
                message: 'An error happened, please try again.'
            })
        }
    } else if (req.body.type === 'productVariation') {
        try {
            const product = await editVariation(req.body.variation)
            Product.findOne({
                where: {
                    id: product.id
                },
                include: [
                    {
                        model: PRODUCT_META,
                        attributes: ['meta_key', 'meta_value']
                    },
                    {
                        model: TERM,
                        required: false
                    }
                ]
            })
                .then(founded => {
                    founded.dataValues.product_meta = _.chain(founded.product_meta).keyBy('meta_key').mapValues('meta_value').value()
                    res.status(200).send(founded)
                })
                .catch(err => console.log(`product with id: ${product.id} not found with err: ${err}`))
        } catch {
            res.status(404).send({
                success: false,
                message: 'An error happened, please try again.'
            })
        }
    } else {
        res.status(400).send({
            success: false,
            message: 'You must specify type of new product.'
        })
    }

}

exports.getOneProduct = (req, res) => {
    PRODUCT.findOne({
        where: {
            id: req.body.id
        },
        include: [
            {
                model: PRODUCT,
                as: 'children',
                include: [{ model: PRODUCT_META }]
            },
            {
                model: PRODUCT_META,
                attributes: ['meta_key', 'meta_value']
            },
            {
                model: TERM,
                required: false
            }
        ],
        order: [
            [
                { model: PRODUCT, as: 'children' },
                'id',
                'ASC'
            ]
        ]
    })
        .then(founded => {
            founded.dataValues.product_meta = _.chain(founded.product_meta).keyBy('meta_key').mapValues('meta_value').value()
            if (founded.children.length) {
                founded.children.forEach(child => {
                    console.log(child.dataValues.product_meta)
                    child.dataValues.product_meta = _.chain(child.product_meta).keyBy('meta_key').mapValues('meta_value').value()
                })
            }
            res.status(200).send(founded)
        })
        .catch(err => console.log(`product with id: ${req.body.id} not found with err: ${err}`))
}

exports.deleteProduct = async (req, res) => {
    let barcode = null
    if (req.body.type === 'editSimple') {
        barcode = req.body.simple.barcode
    } else if (req.body.type === 'editVariable') {
        barcode = req.body.variable.barcode
    } else if (req.body.type === 'productVariation') {
        barcode = req.body.variation.barcode
    } else {
        res.status(400).send({
            success: false,
            message: 'You must specify type of new product.'
        })
    }
    try {
        await PRODUCT.destroy({
            where: {
                barcode: barcode
            }
        }).then(deletedRow => {
            res.status(200).send(barcode)
        }).catch(err => console.log(err))
    } catch {
        res.status(400).send({
            success: false,
            message: 'Something wrong was happened, try again!'
        })
    }
}

exports.deleteProductVariation = (req, res) => {
    try {
        PRODUCT.destroy({
            where: {
                barcode: {
                    [Op.in]: req.body
                }
            }
        }).then(deletedRow => {
            console.log(deletedRow)
            res.status(200).send(req.body)
        }).catch(err => console.log(err))
    } catch {
        res.status(400).send({
            success: false,
            message: 'Something wrong was happened, try again!'
        })
    }
}

exports.manageOnlineSell = async (req, res) => {
    try {
        PRODUCT_META.update({
            meta_value: req.body.value
        }, {
            where: {
                meta_key: '_online_sell',
                productId: req.body.productId
            }
        }).then(updated => {
            res.status(200).send(updated)
        }).catch(err => console.log(`product with id: ${req.body.productId} not update with err: ${err}`))
    } catch {
        res.status(404).send({
            success: false,
            message: 'An error happened, please try again.'
        })
    }
}