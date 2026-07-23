// src/modules/basket/basket.service.js
const { prisma } = require('../../config/db');

async function getBasket(accountId) {
  const rows = await prisma.basketItem.findMany({
    where: { accountId },
    include: { item: true },
    orderBy: { createdAt: 'asc' },
  });
  const totalCents = rows.reduce((sum, row) => sum + row.item.priceCents * row.quantity, 0);
  return { rows, totalCents };
}

async function addOrIncrement(accountId, itemId, quantity = 1) {
  const item = await prisma.item.findUnique({ where: { id: Number(itemId) } });
  if (!item) {
    const err = new Error('That item no longer exists.');
    err.status = 404;
    throw err;
  }

  return prisma.basketItem.upsert({
    where: { accountId_itemId: { accountId, itemId: Number(itemId) } },
    update: { quantity: { increment: quantity } },
    create: { accountId, itemId: Number(itemId), quantity },
    include: { item: true },
  });
}

async function setQuantity(accountId, basketItemId, quantity) {
  if (quantity <= 0) {
    return prisma.basketItem.delete({ where: { id: Number(basketItemId) } }).catch(() => null);
  }
  return prisma.basketItem.update({
    where: { id: Number(basketItemId) },
    data: { quantity },
    include: { item: true },
  });
}

async function remove(accountId, basketItemId) {
  return prisma.basketItem.delete({ where: { id: Number(basketItemId) } });
}

module.exports = { getBasket, addOrIncrement, setQuantity, remove };
