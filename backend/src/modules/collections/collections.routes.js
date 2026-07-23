// src/modules/collections/collections.routes.js
const router = require('express').Router();
const { requireAuth, requireRole } = require('../../middleware/guard');
const controller = require('./collections.controller');

router.get('/', controller.list);
router.post('/', requireAuth, requireRole('MANAGER'), controller.create);
router.delete('/:id', requireAuth, requireRole('MANAGER'), controller.remove);

module.exports = router;
