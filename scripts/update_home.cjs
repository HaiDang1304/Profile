const fs = require('fs');
let c = fs.readFileSync('src/pages/Home.jsx', 'utf8');

c = "import '../styles/hacker.css';\nimport HackerManager from '../components/HackerManager';\n" + c;
c = c.replace('<div className="portfolio-shell">', '<div className="portfolio-shell">\n        <HackerManager />');

fs.writeFileSync('src/pages/Home.jsx', c);
console.log("Home.jsx updated");
