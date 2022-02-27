'use strict'

const { Router } = require('express');
const router = Router();

const { verifyToken } = require('../../middlewares/auth.middlewares');
const { getAll, create, update, remove } = require('../../controllers/category.controllers');

router.get('', verifyToken, getAll);
router.post('', verifyToken, create);
router.put('/:id', verifyToken, update);
router.delete('/:id', verifyToken, remove);

module.exports = router;
