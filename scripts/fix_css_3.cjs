const fs = require('fs');
let css = fs.readFileSync('src/styles/portfolio.css', 'utf8');

// The exact string to find:
// .section-heading h2, .contact-copy h2 { margin: 0; font: 700 clamp(40px, 6vw, 72px)/.95 'Pixelify Sans', sans-serif; letter-spacing: -.025em; }

let target = ".section-heading h2, .contact-copy h2 { margin: 0; font: 700 clamp(40px, 6vw, 72px)/.95 'Pixelify Sans', sans-serif; letter-spacing: -.025em; }";
let replacement = ".section-heading h2, .contact-copy h2 { margin: 0; font-size: clamp(26px, 5vw, 42px); font-family: 'Inter', system-ui, sans-serif; font-weight: 700; letter-spacing: -0.5px; line-height: 1.2; text-transform: none; }";

css = css.replace(target, replacement);

fs.writeFileSync('src/styles/portfolio.css', css);
console.log("CSS Updated successfully");
