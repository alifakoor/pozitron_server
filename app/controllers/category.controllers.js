'use strict';

const Business = require('../db/models/business');
const Category = require('../db/models/category');
const BaseErr = require("../errors/baseErr");
const httpStatusCodes = require("../errors/httpStatusCodes");
const {DataTypes} = require("sequelize");
const { generateSlug } = require('../utils/slug');

async function getChildren(categories) {
	for (const category of categories) {
		const children = await Category.findAll({where: {parentId: category.id}});
		category.setDataValue('children', children);
		await getChildren(children);
	}
	return categories;
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

		const categories = await business.getCategories({
			where: {
				businessId: business.id,
				parentId: null
			}
		});
		if(!categories.length) {
			throw new BaseErr(
				'BusinessDoesNotHaveCategories',
				httpStatusCodes.NOT_FOUND,
				true,
				`There is not any categories.`
			);
		}

		const result = await getChildren(categories);

		return res.status(200).json({
			success: true,
			message: 'The list of categories found successfully.',
			data: result,
			domain: business.domain
		});
	} catch(e) {
		next(e);
	}
}
async function create(req, res, next) {
	try {
		const category = await Category.create({
			name: req.body.name,
			slug: req.body.slug ? req.body.slug : generateSlug(req.body.name),
			description: req.body.description,
			businessId: req.business.id
		});

		if(!category) {
			throw new BaseErr(
				'CategoryNotCreated',
				httpStatusCodes.NOT_IMPLEMENTED,
				true,
				`The category has not been created successfully.`
			);
		}

		return res.json({
			success: true,
			message: 'The category has been created successfully.',
			data: category
		});
	} catch(e) {
		next(e);
	}
}
async function update(req, res, next) {
	try {
		const category = await Category.findOne({ where: { id: Number(req.params.id) }});
		if (!category) {
			throw new BaseErr(
				'CategoryNotFound',
				httpStatusCodes.NOT_FOUND,
				true,
				`The category not found.`
			);
		}

		category.name = req.body.name;
		category.description = req.body.description;
		// category.slug = req.body.slug;

		await category.save();

		return res.json({
			success: true,
			message: 'The category has been updated successfully.',
			data: category
		});
	} catch(e) {
		next(e);
	}
}
async function remove(req, res, next) {
	try {
		const category = await Category.findOne({ where: { id: Number(req.params.id) }});
		if (!category) {
			throw new BaseErr(
				'CategoryNotFound',
				httpStatusCodes.NOT_FOUND,
				true,
				`The category not found.`
			);
		}

		await category.destroy();

		return res.json({
			success: true,
			message: 'The category has been deleted successfully.',
			data: { id: req.params.id }
		});
	} catch(e) {
		next(e);
	}
}

module.exports = {
	getAll,
	create,
	update,
	remove
}

// const getChild = async (categories) => {
// 	let expendPromise = []
// 	categories.forEach(category => {
// 		expendPromise.push(Term.findAll({
// 			where: {
// 				parent_id: category.id
// 			}
// 		}))
// 	})
// 	let child = await Promise.all(expendPromise)
// 	for (let [idx, cat] of child.entries()) {
// 		if (cat.length > 0) {
// 			cat = await getChild(cat)
// 		}
// 		categories[idx].dataValues.children = cat
// 	}
// 	return categories
// }

// exports.categories = (req, res) => {
//     Term.findAll({
//         where: {
//             parent_id: null
//         }
//     }).then(async (categories) => {
//         const result = await getChild(categories)
//         res.status(200).send(result)
//     }).catch((err) => { console.log(`all categories not found with err: ${err}`) })
// }

// exports.syncCategories = async (req, res) => {
//     const api = new Woocommerce({
//         url: "https://onlinenow.ir/sandbox-onlinenow-pos",
//         consumerKey: 'ck_4cc138d1e8246431b4f35ff838c19470754147de',
//         consumerSecret: 'cs_f81e5b2fbf4c715f4898799a63d96c84b6326c81',
//         version: "wc/v3"
//     })
//
//     // list of all categories
//     let result = []
//     let page = 0
//     let total_page = 0
//
//     // get all categories, there is a paginitaion in wc api
//     // so i use a doWhile loop for fetch all data in one array
//     do  {
//         await api.get("products/categories", { page: ++page, per_page: 20, orderby: 'id' }).then(response => {
//             total_page = parseInt(response.headers['x-wp-totalpages'])
//             for (let i = 0; i < response.data.length; i++) {
//                 response.data[i].slug = decodeURIComponent(response.data[i].slug)
//             }
//             result = result.concat(response.data)
//         }).catch((err) => {
//             console.log("Response Status:", err.response.status)
//             console.log("Response Headers:", err.response.headers)
//             console.log("Response Data:", err.response.data)
//         }).finally(() => {})
//     } while (page < total_page)
//
//     // create categories in database and update parents
//     result.forEach(data => {
//         // import categories
//         Term.create({
//             name: data.name,
//             description: data.description,
//             slug: data.slug,
//             count: data.count,
//             type: 'category',
//             status: 'active'
//         }).then((importResult) => {
//             // import meta data of categories
//             TermMeta.bulkCreate([
//                 {
//                     meta_key: '_wc_id',
//                     meta_value: data.id,
//                     termId: importResult.dataValues.id
//                 },
//                 {
//                     meta_key: '_wc_links',
//                     meta_value: JSON.stringify(data._links),
//                     termId: importResult.dataValues.id
//                 }
//             ]).then(() => {
//                 // update parent, this mothafucka is complex
//                 if (data.parent !== 0) {
//                     TermMeta.findOne({
//                         where: { meta_key: '_wc_id', meta_value: data.parent }
//                     }).then((onp_category_parent) => {
//                         TermMeta.findOne({
//                             where: { meta_key: '_wc_id', meta_value: data.id }
//                         }).then((onp_category) => {
//                             Term.findByPk(onp_category.termId).then((category) => {
//                                 category.update({
//                                     parent_id: onp_category_parent.termId
//                                 })
//                             }).catch((err) => { console.log(`not found category: ${err}`) })
//                         }).catch((err) => { console.log(`not found termmeta: ${err}`) })
//                     }).catch((err) => { console.log(`not found termmeta parent ${err}`) })
//                 }
//             }).catch((err) => {
//                 console.log(`create termmeta failed with err: ${err}`)
//             })
//         }).catch((err) => {
//             console.log(`create term failed with err: ${err}`)
//         })
//     })
//
//     res.status(200).send({
//         message: 'sync was successful. enjoy!'
//     })
// }