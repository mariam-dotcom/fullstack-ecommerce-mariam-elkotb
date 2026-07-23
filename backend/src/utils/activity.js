// src/utils/activity.js
const { isMongoReady } = require('../config/db');
const EventLog = require('../models/EventLog');

async function recordEvent(accountId, email, action, detail) {
  if (isMongoReady()) {
    try {
      await EventLog.create({ accountId, email, action, detail });
      return;
    } catch (err) {
      console.warn('[activity] mongo write failed, logging to console instead:', err.message);
    }
  }
  console.log(`[activity:${action}] account=${accountId} email=${email} -> ${detail}`);
}

module.exports = { recordEvent };
