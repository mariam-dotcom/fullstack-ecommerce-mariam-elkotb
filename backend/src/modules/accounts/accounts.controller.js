// src/modules/accounts/accounts.controller.js
const { prisma } = require('../../config/db');

async function getMe(req, res) {
  const account = await prisma.account.findUnique({ where: { id: req.account.id } });
  if (!account) return res.status(404).json({ error: 'Account not found.' });
  const { passwordHash, ...safe } = account;
  return res.json(safe);
}

async function updateMe(req, res) {
  const { displayName } = req.body;
  if (!displayName) return res.status(400).json({ error: 'Display name is required.' });

  const account = await prisma.account.update({
    where: { id: req.account.id },
    data: { displayName },
  });
  const { passwordHash, ...safe } = account;
  return res.json(safe);
}

module.exports = { getMe, updateMe };
