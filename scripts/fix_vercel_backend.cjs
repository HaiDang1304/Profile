const fs = require('fs');
let c = fs.readFileSync('server/index.js', 'utf8');

c = c.replace(
  "initializeDatabase()\n  .then(() => app.listen(port, () => console.log(`Portfolio API: http://localhost:${port}/api`)))\n  .catch((error) => {",
  "initializeDatabase().catch((error) => {\n    console.error('Database Init Error:', error.message);\n  });\n\nif (!process.env.VERCEL) {\n  app.listen(port, () => console.log(`Portfolio API: http://localhost:${port}/api`));\n}\nmodule.exports = app;\n/*"
);

c = c.replace(
  "    console.error('Hãy bật MySQL trong XAMPP và kiểm tra cấu hình server/.env.');\n  });",
  "    console.error('Hãy bật MySQL trong XAMPP và kiểm tra cấu hình server/.env.');\n  });\n*/"
);

// Actually a safer replace:
c = fs.readFileSync('server/index.js', 'utf8');
c = c.replace(
  /initializeDatabase\(\)[\s\S]*?\.then\(\(\) => app\.listen[\s\S]*?\.catch\(\(error\) => \{[\s\S]*?\}\);/m,
  `initializeDatabase().catch((error) => console.error('DB Init Error:', error.message));\nif (!process.env.VERCEL) {\n  app.listen(port, () => console.log(\`Portfolio API: http://localhost:\${port}/api\`));\n}\nmodule.exports = app;`
);

fs.writeFileSync('server/index.js', c);
