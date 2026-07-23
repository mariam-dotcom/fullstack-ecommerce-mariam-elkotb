// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const managerPass = await bcrypt.hash('manager123', 10);
  const shopperPass = await bcrypt.hash('shopper123', 10);

  await prisma.account.upsert({
    where: { email: 'manager@nimbus.shop' },
    update: {},
    create: {
      email: 'manager@nimbus.shop',
      displayName: 'Store Manager',
      passwordHash: managerPass,
      role: 'MANAGER',
    },
  });

  await prisma.account.upsert({
    where: { email: 'shopper@nimbus.shop' },
    update: {},
    create: {
      email: 'shopper@nimbus.shop',
      displayName: 'Demo Shopper',
      passwordHash: shopperPass,
      role: 'SHOPPER',
    },
  });

  const collectionsData = [
    { name: 'Desk & Workspace', blurb: 'Tools for a calmer desk setup.' },
    { name: 'Audio', blurb: 'Headphones and speakers.' },
    { name: 'Everyday Carry', blurb: 'Bags, wallets, and pouches.' },
  ];

  const collections = [];
  for (const c of collectionsData) {
    const created = await prisma.collection.upsert({
      where: { name: c.name },
      update: {},
      create: c,
    });
    collections.push(created);
  }

const items = [
    { title: 'Weighted Desk Lamp', summary: 'Dimmable warm-white lamp with a cast-iron base.', priceCents: 4900, stockCount: 24, collectionId: collections[0].id, imagePath: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80' },
    { title: 'Bamboo Monitor Stand', summary: 'Raises your screen to eye level, storage underneath.', priceCents: 3200, stockCount: 40, collectionId: collections[0].id, imagePath: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80' },
    { title: 'Mechanical Keyboard - Low Profile', summary: 'Quiet tactile switches, USB-C.', priceCents: 8900, stockCount: 15, collectionId: collections[0].id, imagePath: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=600&q=80' },
    { title: 'Open-Back Headphones', summary: 'Natural soundstage for home listening.', priceCents: 12900, stockCount: 10, collectionId: collections[1].id, imagePath: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80' },
    { title: 'Compact Bluetooth Speaker', summary: '12-hour battery, water resistant.', priceCents: 5900, stockCount: 30, collectionId: collections[1].id, imagePath: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80' },
    { title: 'Canvas Field Bag', summary: 'Water-resistant canvas with leather straps.', priceCents: 6900, stockCount: 18, collectionId: collections[2].id, imagePath: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80' },
    { title: 'Slim Cardholder Wallet', summary: 'Holds up to 8 cards, aluminum shell.', priceCents: 2400, stockCount: 3, collectionId: collections[2].id, imagePath: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80' },
  ];

  for (const item of items) {
    const existing = await prisma.item.findFirst({ where: { title: item.title } });
    if (!existing) {
      await prisma.item.create({ data: item });
    } else if (!existing.imagePath) {
      await prisma.item.update({ where: { id: existing.id }, data: { imagePath: item.imagePath } });
    }
  }

  console.log('Seed complete: 2 accounts, 3 collections, 7 items.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
