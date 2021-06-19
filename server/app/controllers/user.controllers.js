/**
 * Requirements
 */
const _ = require('lodash')
const DB = require("../models")
const WC = require('@woocommerce/woocommerce-rest-api').default

/**
 * Models
 */
const Op = DB.Sequelize.Op
const USER = DB.user
const USER_META = DB.usermeta
const TERM = DB.term
const TERM_META = DB.termmeta

const user = {
    getWebsiteData: async (userId) => {
        return await USER_META.findAll({
            where: {
                userId: userId
            }
        }).then((founded_row) => {
            if (founded_row.length !== 0) {
                return _.chain(founded_row).keyBy('meta_key').mapValues('meta_value').value()
            } else {
                return false
            }
        }).catch(err => console.log(err))
    },
    createWcApi: (websiteData) => {
        return new WC ({
            url: "https://"+websiteData._address,
            consumerKey: websiteData._consumer_key,
            consumerSecret: websiteData._consumer_secret,
            version: websiteData._api_version
        })
    },
    createTerm: (term) => {
        return TERM.create({
            name: term.name,
            description: term.description,
            slug: decodeURIComponent(term.slug),
            count: term.count,
            type: 'category',
            status: 'active'
        }).then((created_row) => {
            TERM_META.bulkCreate([
                {
                    meta_key: '_wc_id',
                    meta_value: term.id,
                    termId: created_row.id
                },
                {
                    meta_key: '_links',
                    meta_value: JSON.stringify(term._links),
                    termId: created_row.id
                }
            ]).catch((err) => {
                throw new Error(`Term Meta Not created, ERROR: ${err}`)
            })
            return created_row
        }).then((created_term) => {
            if (term.parent !== 0) {
                TERM_META.findOne({
                    where: { meta_key: '_wc_id', meta_value: term.parent }
                }).then((founded_parent_row) => {
                    created_term.update({
                        parent_id: Number(founded_parent_row.termId)
                    })
                }).catch(err => {
                    throw new Error(`Term Meta for Parent Not Found, Error: ${err}`)
                })
            }
            return created_term
        }).catch(err => {
            throw new Error(`Term Not Created, ERROR: ${err}`)
        })
    }
}

exports.getUserWebsiteData = async (req, res) => {
    const website = await user.getWebsiteData(req.body.id)
    if (website) {
        res.json(website)
    } else {
        throw new Error('Website not found!')
    }
}

exports.setUserWebsiteData = (req, res) => {
    USER_META.bulkCreate([
        {
            meta_key: '_address',
            meta_value: req.body._address,
            userId: req.userId
        },
        {
            meta_key: '_consumer_key',
            meta_value: req.body._consumer_key,
            userId: req.userId
        },
        {
            meta_key: '_consumer_secret',
            meta_value: req.body._consumer_secret,
            userId: req.userId
        },
        {
            meta_key: '_api_version',
            meta_value: 'wc/v3',
            userId: req.userId
        }
    ],{
        updateOnDuplicate: ['meta_value']
    }).then(upserted_rows => {
        console.log(upserted_rows)
    }).catch(err => console.log(err))
}

exports.syncCategories = async (req, res) => {

    const website = await user.getWebsiteData(req.userId)
    if (website) {
        const api = user.createWcApi(website)
        let page, total_page
        page = total_page = 0
        do {
            await api.get("products/categories", { page: ++page, per_page: 2, orderby: 'id' })
                .then(response => {
                    total_page = Number(response.headers['x-wp-totalpages'])
                    response.data.map(async (category) => {
                        await user.createTerm(category)
                    })
                    return true
                })
                .then(response => {
                    if (response) {
                        res.status(200).json({ message: 'Categories Sync was Successful.'})
                    }
                })
                .catch((err) => {
                    console.log("Response Status:", err.response.status)
                    console.log("Response Headers:", err.response.headers)
                    console.log("Response Data:", err.response.data)
                })
                .finally(() => {})
        } while (page < total_page)

    }

    /*
    const api = new WC({
        url: "https://onlinenow.ir/sandbox-onlinenow-pos",
        consumerKey: 'ck_4cc138d1e8246431b4f35ff838c19470754147de',
        consumerSecret: 'cs_f81e5b2fbf4c715f4898799a63d96c84b6326c81',
        version: "wc/v3"
    })

    // list of all categories
    let result = []
    let page = 0
    let total_page = 0

    // get all categories, there is a paginitaion in wc api
    // so i use a doWhile loop for fetch all data in one array
    do  {
        await api.get("products/categories", { page: ++page, per_page: 20, orderby: 'id' }).then(response => {
            total_page = parseInt(response.headers['x-wp-totalpages'])
            for (let i = 0; i < response.data.length; i++) {
                response.data[i].slug = decodeURIComponent(response.data[i].slug)
            }
            result = result.concat(response.data)
        }).catch((err) => {
            console.log("Response Status:", err.response.status)
            console.log("Response Headers:", err.response.headers)
            console.log("Response Data:", err.response.data)
        }).finally(() => {})
    } while (page < total_page)

    // create categories in database and update parents
    result.forEach(data => {
        // import categories
        Term.create({
            name: data.name,
            description: data.description,
            slug: data.slug,
            count: data.count,
            type: 'category',
            status: 'active'
        }).then((importResult) => {
            // import meta data of categories
            TermMeta.bulkCreate([
                {
                    meta_key: '_wc_id',
                    meta_value: data.id,
                    termId: importResult.dataValues.id
                },
                {
                    meta_key: '_wc_links',
                    meta_value: JSON.stringify(data._links),
                    termId: importResult.dataValues.id
                }
            ]).then(() => {
                // update parent, this mothafucka is complex
                if (data.parent !== 0) {
                    TermMeta.findOne({
                        where: { meta_key: '_wc_id', meta_value: data.parent }
                    }).then((onp_category_parent) => {
                        TermMeta.findOne({
                            where: { meta_key: '_wc_id', meta_value: data.id }
                        }).then((onp_category) => {
                            Term.findByPk(onp_category.termId).then((category) => {
                                category.update({
                                    parent_id: onp_category_parent.termId
                                })
                            }).catch((err) => { console.log(`not found category: ${err}`) })
                        }).catch((err) => { console.log(`not found termmeta: ${err}`) })
                    }).catch((err) => { console.log(`not found termmeta parent ${err}`) })
                }
            }).catch((err) => {
                console.log(`create termmeta failed with err: ${err}`)
            })
        }).catch((err) => {
            console.log(`create term failed with err: ${err}`)
        })
    })

    res.status(200).send({
        message: 'sync was successful. enjoy!'
    })
     */
}

exports.syncProducts = (req, res) => {

}

exports.syncVariableProducts = (req, res) => {

}

exports.userBoard = (req, res) => {
    res.status(200).send("User Content.")
}

exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content")
}