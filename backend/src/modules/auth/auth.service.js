// src/modules/auth/auth.service.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { prisma } = require('../../config/db');
const { sendWelcomeEmail } = require('../../utils/mailer');
const { recordEvent } = require('../../utils/activity');

function issueToken(account) {
  return jwt.sign(
    { accountId: account.id, role: account.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

function stripSecret(account) {
  const { passwordHash, ...rest } = account;
  return rest;
}

async function signUp({ displayName, email, password, role }) {
  if (!displayName || !email || !password) {
    const err = new Error('Name, email, and password are all required.');
    err.status = 400;
    throw err;
  }

  const existing = await prisma.account.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) {
    const err = new Error('An account with that email already exists.');
    err.status = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const account = await prisma.account.create({
    data: {
      displayName,
      email: email.toLowerCase(),
      passwordHash,
      role: role === 'MANAGER' ? 'MANAGER' : 'SHOPPER',
    },
  });

  await recordEvent(account.id, account.email, 'ACCOUNT_CREATED', `role=${account.role}`);
  sendWelcomeEmail(account.email, account.displayName);

  return { token: issueToken(account), account: stripSecret(account) };
}

async function signIn({ email, password }) {
  if (!email || !password) {
    const err = new Error('Email and password are required.');
    err.status = 400;
    throw err;
  }

  const account = await prisma.account.findUnique({ where: { email: email.toLowerCase() } });
  if (!account) {
    const err = new Error('Incorrect email or password.');
    err.status = 400;
    throw err;
  }

  const valid = await bcrypt.compare(password, account.passwordHash);
  if (!valid) {
    const err = new Error('Incorrect email or password.');
    err.status = 400;
    throw err;
  }

  await recordEvent(account.id, account.email, 'ACCOUNT_SIGNED_IN', 'ok');
  return { token: issueToken(account), account: stripSecret(account) };
}

module.exports = { signUp, signIn };
