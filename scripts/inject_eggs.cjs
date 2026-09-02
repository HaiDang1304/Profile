const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.jsx', 'utf8');

if (!code.includes('<EasterEggManager />')) {
  code = code.replace('<header className="site-header">', '<EasterEggManager />\n        <header className="site-header">');
}

if (!code.includes('<EasterEgg id="1" />')) {
  code = code.replace('<div className="hero-socials">', '<div className="hero-socials" style={{position: "relative"}}><div style={{position: "absolute", left: -20, top: 10}}><EasterEgg id="1" /></div>');
}

if (!code.includes('<EasterEgg id="2" />')) {
  code = code.replace('<div className="signature">', '<div className="signature" style={{position:"relative"}}><div style={{position:"absolute", top: 10, right: 10}}><EasterEgg id="2" /></div>');
}

if (!code.includes('<EasterEgg id="3" />')) {
  code = code.replace('<div className="project-art__bar">', '<div className="project-art__bar" style={{position:"relative"}}><div style={{position:"absolute", right: 20}}><EasterEgg id="3" /></div>');
}

if (!code.includes('<EasterEgg id="4" />')) {
  code = code.replace('<form onSubmit={submit} className="form-grid">', '<form onSubmit={submit} className="form-grid" style={{position:"relative"}}><div style={{position:"absolute", top: -30, right: 0}}><EasterEgg id="4" /></div>');
}

if (!code.includes('<EasterEgg id="5" />')) {
  code = code.replace('<div className="footer-copyright">', '<div className="footer-copyright" style={{position:"relative"}}><div style={{position:"absolute", top: 0, left: -20}}><EasterEgg id="5" /></div>');
}

fs.writeFileSync('src/pages/Home.jsx', code);
console.log("Eggs injected!");
