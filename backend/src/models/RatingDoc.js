// Mongo-backed rating document (used when Mongo is available).
const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  itemId: { type: Number, required: true, index: true },
  accountId: { type: Number, required: true },
  displayName: { type: String, required: true },
  stars: { type: Number, min: 1, max: 5, required: true },
  note: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('RatingDoc', ratingSchema);
