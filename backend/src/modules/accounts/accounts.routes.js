// src/modules/accounts/accounts.routes.js
const router = require('express').Router();
const { requireAuth } = require('../../middleware/guard');
const controller = require('./accounts.controller');

router.get('/me', requireAuth, controller.getMe);
router.patch('/me', requireAuth, controller.updateMe);

module.exports = router;
