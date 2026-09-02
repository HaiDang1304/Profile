const fs = require('fs');

let c = fs.readFileSync('src/pages/Home.jsx', 'utf8');
c = c.replace("import PhysicsSkillCloud from '../components/PhysicsSkillCloud';\n", "");
c = c.replace("<PhysicsSkillCloud groups={t.stack.groups} />", "");
fs.writeFileSync('src/pages/Home.jsx', c);
console.log('PhysicsSkillCloud removed from Home.jsx');
