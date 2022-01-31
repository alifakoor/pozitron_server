'use strict'

const { Router } = require('express');
const router = Router();

const { verifyToken, verifyWebhook } = require('../../middlewares/auth.middlewares');
const { checkBulkEditReq, checkBulkRemoveReq, checkInputsBeforeCreate } = require('../../middlewares/product.middlewares');
const { getAll, create, edit, remove, createdWithWebhook, updatedWithWebhook, deletedWithWebhook } = require('../../controllers/product.controllers');

router.get('', verifyToken, getAll);
router.post('/create', [ verifyToken, checkInputsBeforeCreate ], create);
router.put('/edit', [ verifyToken, checkBulkEditReq ], edit);
router.post('/remove', [ verifyToken, checkBulkRemoveReq ], remove);
router.post('/webhooks/create/:businessId/:businessKey', [ verifyWebhook ], createdWithWebhook);
router.post('/webhooks/update/:businessId/:businessKey', [ verifyWebhook ], updatedWithWebhook);
router.post('/webhooks/delete/:businessId/:businessKey', [ verifyWebhook ], deletedWithWebhook);

module.exports = router;
