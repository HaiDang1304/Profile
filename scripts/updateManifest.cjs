const fs = require('fs');
const file = 'src/components/canvas/data/spriteManifest.js';
let content = fs.readFileSync(file, 'utf8');

const sceneMap = {
  hero: ['house_traditional', 'dev_character', 'golden_dog', 'cat_sleeping', 'water_urn', 'potted_plant', 'brick_path', 'far_cottage', 'haystack_gold', 'bamboo_grove', 'carrying_pole'],
  about: ['banana_tree', 'water_coconut_grove', 'lotus_hyacinth_cluster', 'monkey_bridge', 'monkey_bridge_detailed', 'duck_adult', 'ducks_swimming', 'duckling', 'water_ripple', 'nipa_palm_cluster', 'flying_storks'],
  projects: ['sampan_boat', 'three_plank_boat_detailed', 'wooden_wharf_detailed', 'wooden_pier', 'mooring_post', 'fruit_basket_watermelon', 'fruit_basket_mango', 'conical_hat', 'boat_reflection'],
  playground: ['fishing_hut', 'fish_shadow', 'distant_shed', 'kingfisher_bird', 'bamboo_fence'],
  contact: ['kerosene_lantern', 'lantern_halo', 'brick_stove', 'campfire_kitchen_detailed', 'full_moon', 'fire_halo', 'fire_glow_halo', 'moon_reflection', 'sleeping_dog', 'smoke_puff_pixel', 'smoke_puff', 'tea_kettle', 'hammock_coconut']
};

const categoryMap = {
  architecture: 'landscape',
  flora: 'landscape',
  structure: 'landscape',
  character: 'object',
  animal: 'object',
  prop: 'object',
  vehicle: 'object'
};

content = content.replace(/\{\s*key:\s*'([^']+)'[\s\S]*?(?=\},|\}\];)/g, (match, key) => {
  let scene = 'hero';
  for (let s in sceneMap) {
    if (sceneMap[s].includes(key)) scene = s;
  }
  
  let newMatch = match.replace(/category:\s*'([^']+)'/, (m, cat) => {
    let newCat = categoryMap[cat] || 'object';
    if (key.includes('path') || key.includes('ripple') || key.includes('reflection')) newCat = 'ground';
    return `category: '${newCat}',\n    scene: '${scene}'`;
  });
  
  return newMatch;
});

fs.writeFileSync(file, content);
console.log('Manifest updated');
