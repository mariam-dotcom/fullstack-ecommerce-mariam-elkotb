// src/modules/catalog/catalog.routes.js
const router = require('express').Router();
const upload = require('../../middleware/imageUpload');
const { requireAuth, requireRole } = require('../../middleware/guard');
const controller = require('./catalog.controller');

router.get('/', controller.list);
router.get('/:id', controller.getById);
router.post('/', requireAuth, requireRole('MANAGER'), upload.single('image'), controller.create);
router.patch('/:id', requireAuth, requireRole('MANAGER'), upload.single('image'), controller.update);
router.delete('/:id', requireAuth, requireRole('MANAGER'), controller.remove);

module.exports = router;
