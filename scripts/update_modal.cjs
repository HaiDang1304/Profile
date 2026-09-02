const fs = require('fs');
let code = fs.readFileSync('src/components/WelcomeModal.jsx', 'utf8');

code = code.replace(
  "{ cmd: \"sys.quest('easter_egg')\", desc: \"Tìm 5 viên ngọc ẩn để kích hoạt pháo hoa\" },\n",
  ""
);

fs.writeFileSync('src/components/WelcomeModal.jsx', code);
console.log("WelcomeModal updated!");
