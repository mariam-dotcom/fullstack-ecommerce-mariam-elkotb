// tests/auth.test.js
const request = require('supertest');
const app = require('../src/app');

jest.mock('../src/config/db', () => ({
  prisma: {
    account: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
  connectMongo: jest.fn().mockResolvedValue(true),
  isMongoReady: jest.fn().mockReturnValue(false),
}));
jest.mock('../src/utils/mailer', () => ({
  sendWelcomeEmail: jest.fn().mockResolvedValue(undefined),
}));
const { prisma } = require('../src/config/db');

describe('POST /api/auth/sign-up', () => {
  beforeEach(() => jest.clearAllMocks());

  it('creates an account and returns a token', async () => {
    prisma.account.findUnique.mockResolvedValue(null);
    prisma.account.create.mockResolvedValue({
      id: 1,
      email: 'demo@nimbus.shop',
      displayName: 'Demo',
      role: 'SHOPPER',
      passwordHash: 'hashed',
    });

    const res = await request(app).post('/api/auth/sign-up').send({
      displayName: 'Demo',
      email: 'demo@nimbus.shop',
      password: 'password123',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.account).not.toHaveProperty('passwordHash');
  });

  it('rejects missing fields', async () => {
    const res = await request(app).post('/api/auth/sign-up').send({ email: 'x@x.com' });
    expect(res.statusCode).toBe(400);
  });
});

describe('POST /api/auth/sign-in', () => {
  it('rejects an unknown account', async () => {
    prisma.account.findUnique.mockResolvedValue(null);
    const res = await request(app).post('/api/auth/sign-in').send({
      email: 'nobody@nimbus.shop',
      password: 'whatever',
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
