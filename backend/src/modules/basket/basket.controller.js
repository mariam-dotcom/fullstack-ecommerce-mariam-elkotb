// src/modules/basket/basket.controller.js
const service = require('./basket.service');

async function view(req, res) {
  const basket = await service.getBasket(req.account.id);
  return res.json(basket);
}

async function add(req, res) {
  try {
    const { itemId, quantity } = req.body;
    const row = await service.addOrIncrement(req.account.id, itemId, Number(quantity) || 1);
    return res.status(201).json(row);
  } catch (err) {
    return res.status(err.status || 400).json({ error: err.message || 'Could not add to basket.' });
  }
}

async function updateQuantity(req, res) {
  try {
    const row = await service.setQuantity(req.account.id, req.params.id, Number(req.body.quantity));
    return res.json(row);
  } catch (err) {
    return res.status(400).json({ error: 'Could not update quantity.' });
  }
}

async function remove(req, res) {
  try {
    await service.remove(req.account.id, req.params.id);
    return res.status(204).send();
  } catch (err) {
    return res.status(400).json({ error: 'Could not remove item from basket.' });
  }
}

module.exports = { view, add, updateQuantity, remove };
