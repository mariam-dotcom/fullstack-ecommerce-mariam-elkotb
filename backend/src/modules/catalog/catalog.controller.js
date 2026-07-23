// src/modules/catalog/catalog.controller.js
const service = require('./catalog.service');

async function list(req, res) {
  try {
    const result = await service.list(req.query);
    return res.json(result);
  } catch (err) {
    console.error('[catalog.list]', err);
    return res.status(500).json({ error: 'Could not load the catalog right now.' });
  }
}

async function getById(req, res) {
  try {
    const item = await service.getById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found.' });
    return res.json(item);
  } catch (err) {
    console.error('[catalog.getById]', err);
    return res.status(500).json({ error: 'Could not load this item.' });
  }
}

async function create(req, res) {
  try {
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    const item = await service.create(req.body, imagePath);
    return res.status(201).json(item);
  } catch (err) {
    console.error('[catalog.create]', err);
    return res.status(400).json({ error: 'Could not create item. Check the fields and try again.' });
  }
}

async function update(req, res) {
  try {
    const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined;
    const item = await service.update(req.params.id, req.body, imagePath);
    return res.json(item);
  } catch (err) {
    console.error('[catalog.update]', err);
    return res.status(400).json({ error: 'Could not update item.' });
  }
}

async function remove(req, res) {
  try {
    await service.remove(req.params.id);
    return res.status(204).send();
  } catch (err) {
    console.error('[catalog.remove]', err);
    return res.status(400).json({ error: 'Could not delete item.' });
  }
}

module.exports = { list, getById, create, update, remove };
