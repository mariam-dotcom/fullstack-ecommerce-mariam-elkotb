// src/modules/basket/basket.routes.js
const router = require('express').Router();
const { requireAuth } = require('../../middleware/guard');
const controller = require('./basket.controller');

router.use(requireAuth);
router.get('/', controller.view);
router.post('/', controller.add);
router.patch('/:id', controller.updateQuantity);
router.delete('/:id', controller.remove);

module.exports = router;
