// src/modules/stats/stats.controller.js
const { prisma } = require('../../config/db');

async function overview(req, res) {
  try {
    const [itemCount, collectionCount, accountCount, basketRows] = await Promise.all([
      prisma.item.count(),
      prisma.collection.count(),
      prisma.account.count(),
      prisma.basketItem.findMany({ include: { item: true } }),
    ]);

    const lowStock = await prisma.item.findMany({
      where: { stockCount: { lt: 5 } },
      orderBy: { stockCount: 'asc' },
      take: 5,
    });

    const basketValueCents = basketRows.reduce((sum, row) => sum + row.item.priceCents * row.quantity, 0);

    return res.json({
      itemCount,
      collectionCount,
      accountCount,
      openBasketValueCents: basketValueCents,
      lowStock,
    });
  } catch (err) {
    console.error('[stats.overview]', err);
    return res.status(500).json({ error: 'Could not load store statistics.' });
  }
}

module.exports = { overview };
