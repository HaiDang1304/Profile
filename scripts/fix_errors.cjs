const fs = require('fs');
let c = fs.readFileSync('server/index.js', 'utf8');
c = c.replace(
  "const express = require('express');",
  "const express = require('express');\nrequire('express-async-errors');"
);
c = c.replace(
  /res\.status\(500\)\.json\(\{.*\}\);/g,
  "res.status(500).json({ error: error.message || 'Server error', stack: error.stack, env: process.env.DB_HOST });"
);
fs.writeFileSync('server/index.js', c);
