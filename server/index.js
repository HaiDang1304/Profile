require('dotenv').config();
const express = require('express');
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
  res.status(500).json({ error: 'Đã xảy ra lỗi phía máy chủ.' });
});

initializeDatabase()
  .then(() => app.listen(port, () => console.log(`Portfolio API: http://localhost:${port}/api`)))
  .catch((error) => {
    console.error('Không thể kết nối MySQL:', error.message);
    console.error('Hãy bật MySQL trong XAMPP và kiểm tra cấu hình server/.env.');
    process.exit(1);
  });
