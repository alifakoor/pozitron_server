'use strict'

const { Router } = require('express');
const router = Router();

const { verifyToken, verifyWebhook } = require('../../middlewares/auth.middlewares');
const { createdWithWebhook, updatedWithWebhook, deletedWithWebhook } = require('../../controllers/order.controllers');

router.post('/webhook/create/:businessId/:businessKey', verifyWebhook, createdWithWebhook);
router.post('/webhook/update/:businessId/:businessKey', verifyWebhook, updatedWithWebhook);
router.post('/webhook/delete/:businessId/:businessKey', verifyWebhook, deletedWithWebhook);

module.exports = router;