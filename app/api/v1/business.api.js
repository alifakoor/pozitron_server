'use strict';

const { Router } = require('express');
const router = Router();

const { verifyToken, checkDomainAndKeys } = require('../../middlewares/auth.middlewares');
const { check, checkDomain, create } = require('../../controllers/business.controllers');

router.post('/check', verifyToken, check);
router.post('/check_domain', [verifyToken, checkDomainAndKeys], checkDomain);
router.post('/create', [verifyToken, checkDomainAndKeys], create);

module.exports = router;