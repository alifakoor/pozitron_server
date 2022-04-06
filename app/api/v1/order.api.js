'use strict'

const { Router } = require('express');
const router = Router();

const { verifyToken, verifyWebhook } = require('../../middlewares/auth.middlewares');
const { checkInputsBeforeCreate } = require('../../middlewares/order.middlewares');
const {
	getAll,
	create,
	edit,
	remove,
	createdWithWebhook,
	updatedWithWebhook,
	deletedWithWebhook
} = require('../../controllers/order.controllers');

router.get('', verifyToken, getAll);
router.post('', verifyToken, checkInputsBeforeCreate, create);
router.put('', verifyToken, edit);
router.delete('', verifyToken, remove);

router.post('/webhook/create/:businessId/:businessKey', verifyWebhook, createdWithWebhook);
router.post('/webhook/update/:businessId/:businessKey', verifyWebhook, updatedWithWebhook);
router.post('/webhook/delete/:businessId/:businessKey', verifyWebhook, deletedWithWebhook);

module.exports = router;