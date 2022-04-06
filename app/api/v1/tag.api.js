'use strict'

const { Router } = require('express');
const router = Router();

const { verifyToken } = require('../../middlewares/auth.middlewares');
const { getAll, create, remove } = require('../../controllers/tag.controllers');

router.get('', verifyToken, getAll);
router.post('', verifyToken, create);
router.delete('/:id', verifyToken, remove);

module.exports = router;
