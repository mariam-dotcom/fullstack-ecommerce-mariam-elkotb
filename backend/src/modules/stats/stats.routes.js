// src/modules/stats/stats.routes.js
const router = require('express').Router();
const { requireAuth, requireRole } = require('../../middleware/guard');
const controller = require('./stats.controller');

router.get('/', requireAuth, requireRole('MANAGER'), controller.overview);

module.exports = router;
