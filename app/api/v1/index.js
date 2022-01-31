const { Router } = require('express');
const router = Router();
const auth = require('./auth.api');
const business = require('./business.api');
const product = require('./product.api');

router.use('/auth', auth);
router.use('/business', business);
router.use('/products', product);

module.exports = router;