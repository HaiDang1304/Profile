const fs = require('fs');
let text = fs.readFileSync('src/components/canvas/sprites/Retro8BitSprites.js');
let str = text.toString('utf16le');
if (str.includes('\0')) {
  str = text.toString('utf8'); // Not utf16le
}
str = str.replace(/'W': '#92400e', 'w': '#78350f', \/\/ Wood column/g, "'W': '#92400e', 'x': '#78350f', // Wood column");
str = str.replace(/OWWwO/g, 'OWWxO');
str = str.replace(/OWwO/g, 'OWxO');
fs.writeFileSync('src/components/canvas/sprites/Retro8BitSprites.js', str, 'utf8');
console.log('Done');
