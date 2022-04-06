const { Router } = require('express');
const router = Router();
const auth = require('./auth.api');
const business = require('./business.api');
const product = require('./product.api');
const order = require('./order.api');
const category = require('./category.api');
const tag = require('./tag.api');

router.use('/auth', auth);
router.use('/business', business);
router.use('/products', product);
router.use('/orders', order);
router.use('/categories', category);
router.use('/tags', tag);

module.exports = router;