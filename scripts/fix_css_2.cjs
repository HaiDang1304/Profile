const fs = require('fs');
let css = fs.readFileSync('src/styles/portfolio.css', 'utf8');

css = css.replace(/\.section-heading h2, \.contact-copy h2 \{[^}]+\}/g, (match) => {
  if (match.includes('clamp(34px')) {
    return '.section-heading h2, .contact-copy h2 { font-size: clamp(26px, 5vw, 36px); font-family: "Inter", system-ui, sans-serif; font-weight: 700; letter-spacing: -0.5px; line-height: 1.3; }';
  }
  if (match.includes('clamp(28px')) {
    return '.section-heading h2, .contact-copy h2 { font-size: clamp(22px, 6vw, 26px); }';
  }
  return match;
});

fs.writeFileSync('src/styles/portfolio.css', css);
console.log("CSS Updated!");
