const fs = require('fs');
let c = fs.readFileSync('src/components/VisitorBox.jsx', 'utf8');
c = c.replace("flex: '0 0 auto'", "flex: '1 1 150px'");
fs.writeFileSync('src/components/VisitorBox.jsx', c);
