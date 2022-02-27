'use strict';

const Business = require('../db/models/business');
const Tag = require('../db/models/tag');
const BaseErr = require("../errors/baseErr");
const httpStatusCodes = require("../errors/httpStatusCodes");

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

		const tags = await business.getTags({
			where: {
				businessId: business.id
			}
		});
		if(!tags.length) {
			throw new BaseErr(
				'BusinessDoesNotHaveTags',
				httpStatusCodes.NOT_FOUND,
				true,
				`There is not any tags.`
			);
		}

		return res.status(200).json({
			success: true,
			message: 'The list of tags found successfully.',
			data: tags,
			domain: business.domain
		});
	} catch(e) {
		next(e);
	}
}
async function create(req, res, next) {
	try {
		const tag = await Tag.create(req.body);
		if(!tag) {
			throw new BaseErr(
				'TagNotCreated',
				httpStatusCodes.NOT_IMPLEMENTED,
				true,
				`The tag has not been created successfully.`
			);
		}

		return res.json({
			success: true,
			message: 'The tag has been created successfully.',
			data: tag
		});
	} catch(e) {
		next(e);
	}
}
async function remove(req, res, next) {
	try {
		const tag = await Tag.findOne({ where: { id: Number(req.params.id) }});
		if (!tag) {
			throw new BaseErr(
				'TagNotFound',
				httpStatusCodes.NOT_FOUND,
				true,
				`The tag not found.`
			);
		}

		await tag.destroy();

		return res.json({
			success: true,
			message: 'The tag has been deleted successfully.',
			data: { id: req.params.id }
		});
	} catch(e) {
		next(e);
	}
}

module.exports = {
	getAll,
	create,
	remove
}