const fs = require('fs');
let css = fs.readFileSync('src/styles/portfolio.css', 'utf8');

css = css.replace(/\.content-section \{ padding: 140px 0; \}/g, '.content-section { padding: 80px 0; }');
css = css.replace(/\.content-section \{ padding: 88px 0; \}/g, '.content-section { padding: 50px 0; }');

css = css.replace(/\.section-heading \{ margin-bottom: 75px; \}/g, '.section-heading { margin-bottom: 30px; }');
css = css.replace(/\.section-heading \{ margin-bottom: 38px; \}/g, '.section-heading { margin-bottom: 20px; }');

css = css.replace(/\.section-heading h2, \.contact-copy h2 \{ font-size: clamp\(55px, 15vw, 100px\); \}/g, '.section-heading h2, .contact-copy h2 { font-size: clamp(34px, 8vw, 48px); font-family: "Inter", "Segoe UI", sans-serif; font-weight: 800; letter-spacing: -1px; text-transform: uppercase; }');

css = css.replace(/\.section-heading h2, \.contact-copy h2 \{ font-size: clamp\(39px, 13vw, 58px\); \}/g, '.section-heading h2, .contact-copy h2 { font-size: clamp(28px, 8vw, 36px); }');

fs.writeFileSync('src/styles/portfolio.css', css);
console.log("CSS Updated!");
