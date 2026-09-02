const fs = require('fs');
let c = fs.readFileSync('src/styles/portfolio.css', 'utf8');
c = c.replace(
  ".hero-copy h1 { max-width: 650px; margin: 0; font: 700 clamp(54px, 7vw, 94px)/.82 'Pixelify Sans', sans-serif; letter-spacing: -.035em; text-shadow: 5px 5px 0 color-mix(in srgb, var(--purple) 60%, transparent); }",
  ".hero-copy h1 { max-width: 100%; margin: 0; font: 700 clamp(38px, 6vw, 76px)/.82 'Pixelify Sans', sans-serif; letter-spacing: -.035em; text-shadow: 5px 5px 0 color-mix(in srgb, var(--purple) 60%, transparent); }"
);
c = c.replace(
  ".hero-copy h1 { font-size: clamp(58px, 13vw, 88px); }",
  ".hero-copy h1 { font-size: clamp(40px, 10vw, 70px); white-space: nowrap; }"
);
c = c.replace(
  ".hero-copy h1 { font-size: clamp(48px, 17vw, 72px); }",
  ".hero-copy h1 { font-size: clamp(32px, 10vw, 52px); white-space: nowrap; }"
);
fs.writeFileSync('src/styles/portfolio.css', c);
