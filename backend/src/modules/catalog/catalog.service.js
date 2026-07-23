// src/modules/catalog/catalog.service.js
const { prisma } = require('../../config/db');

async function list(query) {
  const { q, collectionId, minCents, maxCents, sort, order, page, perPage } = query;

  const where = {};
  if (q) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { summary: { contains: q, mode: 'insensitive' } },
    ];
  }
  if (collectionId) where.collectionId = Number(collectionId);
  if (minCents || maxCents) {
    where.priceCents = {};
    if (minCents) where.priceCents.gte = Number(minCents);
    if (maxCents) where.priceCents.lte = Number(maxCents);
  }

  let orderBy = { createdAt: 'desc' };
  if (sort === 'price') orderBy = { priceCents: order === 'desc' ? 'desc' : 'asc' };
  if (sort === 'title') orderBy = { title: order === 'desc' ? 'desc' : 'asc' };

  const currentPage = Math.max(Number(page) || 1, 1);
  const pageSize = Math.min(Number(perPage) || 12, 60);
  const skip = (currentPage - 1) * pageSize;

  const [items, total] = await prisma.$transaction([
    prisma.item.findMany({ where, orderBy, skip, take: pageSize, include: { collection: true } }),
    prisma.item.count({ where }),
  ]);

  return {
    items,
    page: { current: currentPage, size: pageSize, total, pages: Math.ceil(total / pageSize) },
  };
}

async function getById(id) {
  return prisma.item.findUnique({
    where: { id: Number(id) },
    include: { collection: true },
  });
}

async function create(data, imagePath) {
  return prisma.item.create({
    data: {
      title: data.title,
      summary: data.summary || null,
      priceCents: Math.round(Number(data.priceCents)),
      stockCount: Number(data.stockCount) || 0,
      collectionId: Number(data.collectionId),
      imagePath: imagePath || null,
    },
  });
}

async function update(id, data, imagePath) {
  const patch = { ...data };
  if (patch.priceCents !== undefined) patch.priceCents = Math.round(Number(patch.priceCents));
  if (patch.stockCount !== undefined) patch.stockCount = Number(patch.stockCount);
  if (patch.collectionId !== undefined) patch.collectionId = Number(patch.collectionId);
  if (imagePath) patch.imagePath = imagePath;

  return prisma.item.update({ where: { id: Number(id) }, data: patch });
}

async function remove(id) {
  return prisma.item.delete({ where: { id: Number(id) } });
}

module.exports = { list, getById, create, update, remove };
