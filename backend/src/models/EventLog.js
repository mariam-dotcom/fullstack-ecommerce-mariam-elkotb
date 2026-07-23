// Mongo-backed activity log for auditing account actions.
const mongoose = require('mongoose');

const eventLogSchema = new mongoose.Schema({
  accountId: Number,
  email: String,
  action: String,
  detail: String,
}, { timestamps: true });

module.exports = mongoose.model('EventLog', eventLogSchema);
