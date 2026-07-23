// src/config/db.js
const { PrismaClient } = require('@prisma/client');
const mongoose = require('mongoose');
require('dotenv').config();

const prisma = new PrismaClient();

let mongoReady = false;

async function connectMongo() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/nimbus';
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    mongoReady = true;
    console.log(`[mongo] connected -> ${uri}`);
  } catch (err) {
    mongoReady = false;
    console.warn(`[mongo] unavailable (${err.message}). Falling back to Postgres for ratings/logs.`);
  }
}

module.exports = {
  prisma,
  connectMongo,
  isMongoReady: () => mongoReady,
};
