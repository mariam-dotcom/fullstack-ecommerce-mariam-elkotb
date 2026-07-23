// src/modules/ratings/ratings.controller.js
const service = require('./ratings.service');
const { prisma } = require('../../config/db');

async function list(req, res) {
  try {
    const ratings = await service.listForItem(req.params.itemId);
    return res.json(ratings);
  } catch (err) {
    console.error('[ratings.list]', err);
    return res.status(500).json({ error: 'Could not load ratings.' });
  }
}

async function create(req, res) {
  try {
    const account = await prisma.account.findUnique({ where: { id: req.account.id } });
    const rating = await service.create(req.params.itemId, account, req.body);
    return res.status(201).json(rating);
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message || 'Could not submit rating.' });
  }
}

module.exports = { list, create };
