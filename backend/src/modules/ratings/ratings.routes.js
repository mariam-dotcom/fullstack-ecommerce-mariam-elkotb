// src/modules/ratings/ratings.routes.js
const router = require('express').Router();
const { requireAuth } = require('../../middleware/guard');
const controller = require('./ratings.controller');

router.get('/:itemId', controller.list);
router.post('/:itemId', requireAuth, controller.create);

module.exports = router;
