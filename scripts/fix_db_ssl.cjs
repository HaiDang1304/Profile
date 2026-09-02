const fs = require('fs');
let c = fs.readFileSync('server/database.js', 'utf8');

c = c.replace(
  "charset: 'utf8mb4',",
  "charset: 'utf8mb4', ssl: process.env.DB_HOST && process.env.DB_HOST.includes('tidbcloud') ? { rejectUnauthorized: true } : undefined,"
);

fs.writeFileSync('server/database.js', c);
