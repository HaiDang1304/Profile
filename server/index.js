require('dotenv').config();
const express = require('express');
require('express-async-errors');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const { initializeDatabase } = require('./database');

const app = express();
const port = Number(process.env.PORT || 4000);

app.disable('x-powered-by');
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));
app.use('/api', apiRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: error.message || 'Server error', stack: error.stack, env: process.env.DB_HOST });
});

initializeDatabase().catch((error) => console.error('DB Init Error:', error.message));
if (!process.env.VERCEL) {
  app.listen(port, () => console.log(`Portfolio API: http://localhost:${port}/api`));
}
module.exports = app;
