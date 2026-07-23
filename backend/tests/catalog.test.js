// tests/catalog.test.js
const request = require('supertest');
const app = require('../src/app');

jest.mock('../src/config/db', () => ({
  prisma: {
    $transaction: jest.fn(),
   item: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
  connectMongo: jest.fn().mockResolvedValue(true),
  isMongoReady: jest.fn().mockReturnValue(false),
}));

const { prisma } = require('../src/config/db');

describe('GET /api/catalog', () => {
  it('returns a paginated list of items', async () => {
    prisma.$transaction.mockResolvedValue([
      [{ id: 1, title: 'Desk Lamp', priceCents: 4900, collection: { name: 'Desk & Workspace' } }],
      1,
    ]);

    const res = await request(app).get('/api/catalog?page=1&perPage=12');

    expect(res.statusCode).toBe(200);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.page.total).toBe(1);
  });
});

describe('GET /api/catalog/:id', () => {
  it('returns 404 for a missing item', async () => {
    prisma.item.findUnique.mockResolvedValue(null);
    const res = await request(app).get('/api/catalog/999');
    expect(res.statusCode).toBe(404);
  });
});
