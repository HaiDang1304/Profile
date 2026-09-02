const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.jsx', 'utf8');

code = code.replace("import { EasterEggManager, EasterEgg } from '../components/EasterEggManager';\n", "");
code = code.replace('<EasterEggManager />\n', '');
code = code.replace('<div style={{position:"absolute", right: 20}}><EasterEgg id="3" /></div>', '');
code = code.replace('<div style={{position: "absolute", left: -20, top: 10}}><EasterEgg id="1" /></div>', '');
code = code.replace('<div style={{position:"absolute", top: 10, right: 10}}><EasterEgg id="2" /></div>', '');
code = code.replace('<div style={{position:"absolute", top: -30, right: 0}}><EasterEgg id="4" /></div>', '');
code = code.replace('<div style={{position:"absolute", top: 0, left: -20}}><EasterEgg id="5" /></div>', '');

fs.writeFileSync('src/pages/Home.jsx', code);
console.log("Removed from Home.jsx");
