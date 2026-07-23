// src/server.js
require('dotenv').config();
const app = require('./app');
const { connectMongo } = require('./config/db');

const PORT = process.env.PORT || 5000;

(async () => {
  await connectMongo();
  app.listen(PORT, () => {
    console.log(`Nimbus API listening on http://localhost:${PORT}`);
  });
})();
