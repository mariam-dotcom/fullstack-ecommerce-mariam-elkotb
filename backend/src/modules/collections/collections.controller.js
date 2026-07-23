// src/modules/collections/collections.controller.js
const { prisma } = require('../../config/db');

async function list(req, res) {
  const collections = await prisma.collection.findMany({ orderBy: { name: 'asc' } });
  return res.json(collections);
}

async function create(req, res) {
  try {
    const { name, blurb } = req.body;
    if (!name) return res.status(400).json({ error: 'A collection name is required.' });
    const collection = await prisma.collection.create({ data: { name, blurb } });
    return res.status(201).json(collection);
  } catch (err) {
    return res.status(400).json({ error: 'Could not create collection (name may already exist).' });
  }
}

async function remove(req, res) {
  try {
    await prisma.collection.delete({ where: { id: Number(req.params.id) } });
    return res.status(204).send();
  } catch (err) {
    return res.status(400).json({ error: 'Could not delete collection.' });
  }
}

module.exports = { list, create, remove };
