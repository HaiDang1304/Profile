const fs = require('fs');

let c = fs.readFileSync('src/pages/Home.jsx', 'utf8');
c = c.replace("import '../styles/hacker.css';\n", "");
c = c.replace("import HackerManager from '../components/HackerManager';\n", "");
c = c.replace('<HackerManager />', '');
fs.writeFileSync('src/pages/Home.jsx', c);
console.log('Home.jsx reverted.');
