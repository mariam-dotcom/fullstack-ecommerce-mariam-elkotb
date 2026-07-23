// src/modules/ratings/ratings.service.js
const { prisma, isMongoReady } = require('../../config/db');
const RatingDoc = require('../../models/RatingDoc');

async function listForItem(itemId) {
  if (isMongoReady()) {
    const docs = await RatingDoc.find({ itemId: Number(itemId) }).sort({ createdAt: -1 }).lean();
    return docs.map((d) => ({
      id: d._id.toString(),
      stars: d.stars,
      note: d.note,
      displayName: d.displayName,
      createdAt: d.createdAt,
    }));
  }
  const rows = await prisma.rating.findMany({
    where: { itemId: Number(itemId) },
    include: { account: true },
    orderBy: { createdAt: 'desc' },
  });
  return rows.map((r) => ({
    id: r.id,
    stars: r.stars,
    note: r.note,
    displayName: r.account.displayName,
    createdAt: r.createdAt,
  }));
}

async function create(itemId, account, { stars, note }) {
  if (!stars) {
    const err = new Error('A star rating (1-5) is required.');
    err.status = 400;
    throw err;
  }

  if (isMongoReady()) {
    return RatingDoc.create({
      itemId: Number(itemId),
      accountId: account.id,
      displayName: account.displayName,
      stars: Number(stars),
      note: note || '',
    });
  }
  return prisma.rating.create({
    data: {
      itemId: Number(itemId),
      accountId: account.id,
      stars: Number(stars),
      note: note || '',
    },
  });
}

module.exports = { listForItem, create };
