const fs = require('fs');
let code = fs.readFileSync('src/components/GlobalStickyNotes.jsx', 'utf8');

code = code.replace(
  "if (e.target.closest('.sticky-note-item') || e.target.closest('button') || e.target.closest('a')) return;",
  "if (e.target.closest('.sticky-note-item') || e.target.closest('button') || e.target.closest('a') || e.target.closest('#home') || e.target.closest('.site-header')) return;"
);

fs.writeFileSync('src/components/GlobalStickyNotes.jsx', code);
console.log("GlobalStickyNotes updated!");
