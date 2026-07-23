// src/modules/auth/auth.controller.js
const authService = require('./auth.service');

async function signUp(req, res) {
  try {
    const result = await authService.signUp(req.body);
    return res.status(201).json(result);
  } catch (err) {
    if (!err.status) console.error('[auth.signUp]', err);
    return res.status(err.status || 500).json({ error: err.message || 'Could not create account.' });
  }
}

async function signIn(req, res) {
  try {
    const result = await authService.signIn(req.body);
    return res.json(result);
  } catch (err) {
    if (!err.status) console.error('[auth.signUp]', err);
    return res.status(err.status || 500).json({ error: err.message || 'Could not sign in.' });
  }
}

module.exports = { signUp, signIn };
