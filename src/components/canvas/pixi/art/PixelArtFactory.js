import { Container, Graphics } from 'pixi.js';
import { getObjectClass } from '../tiled/tiledUtils';

const CHARACTER_PALETTES = {
  developer: { shirt: '#1f7a67', trim: '#f6bd43', trousers: '#20324b', prop: 'laptop' },
  farmer: { shirt: '#356c8d', trim: '#8fd36f', trousers: '#3e352b', prop: 'basket' },
  porter: { shirt: '#d96d38', trim: '#ffd35c', trousers: '#24364d', prop: 'crate' },
  maker: { shirt: '#208e87', trim: '#69e0d0', trousers: '#28364a', prop: 'tablet' },
  child: { shirt: '#e95462', trim: '#73ddd2', trousers: '#304b69', prop: 'kite' },
  neighbor: { shirt: '#98643d', trim: '#ffd16c', trousers: '#263852', prop: 'lantern' },
};

function rect(graphics, x, y, width, height, color) {
  graphics.rect(Math.round(x), Math.round(y), Math.max(1, Math.round(width)), Math.max(1, Math.round(height))).fill(color);
}

function poly(graphics, points, color) {
  graphics.poly(points.flatMap(([x, y]) => [Math.round(x), Math.round(y)])).fill(color);
}

function graphicsFrom(draw) {
  const graphics = new Graphics();
  draw(graphics);
  return graphics;
}

function triangleWave(value) {
  const cycle = ((value % 2) + 2) % 2;
  return { value: cycle <= 1 ? cycle : 2 - cycle, direction: cycle <= 1 ? 1 : -1 };
}

function createHouse(object) {
  const root = new Container();
  const width = object.width || 124;
  const height = object.height || 90;
  const lit = object.propertiesMap.lit;
  const body = graphicsFrom((g) => {
    rect(g, 8, 34, width - 16, height - 34, '#3b271f');
    rect(g, 11, 37, width - 22, height - 40, '#87502d');
    rect(g, 17, 43, width - 34, 6, '#b8733a');
    poly(g, [[0, 35], [22, 9], [width - 21, 9], [width, 35]], '#38251e');
    poly(g, [[6, 32], [25, 13], [width - 24, 13], [width - 6, 32]], '#9b5b2e');
    for (let index = 0; index < 8; index += 1) rect(g, 19 + index * ((width - 40) / 8), 16 + index % 2, 8, 3, '#c37a3b');
    rect(g, 21, height - 31, 23, 31, '#42291f');
    rect(g, 29, height - 17, 3, 3, '#deb15a');
    rect(g, width - 49, height - 33, 29, 22, '#302821');
    rect(g, width - 44, height - 28, 19, 13, lit ? '#ffd574' : '#9cd4c7');
    rect(g, width - 35, height - 29, 2, 15, '#4c3325');
    rect(g, width - 45, height - 22, 21, 2, '#4c3325');
    rect(g, 12, height, 5, 23, '#3b281f');
    rect(g, width - 18, height, 5, 23, '#3b281f');
    rect(g, 4, height + 19, width - 8, 4, '#251e1a');
  });
  root.addChild(body);

  const glow = graphicsFrom((g) => {
    rect(g, width - 48, height - 34, 27, 24, '#ffd36b');
  });
  glow.alpha = lit ? 0.12 : 0;
  root.addChild(glow);
  return {
    view: root,
    update(time, _delta, energy) {
      if (lit) glow.alpha = 0.08 + (Math.sin(time * 5) + 1) * 0.035 + energy * 0.08;
    },
  };
}

function createPalm(object) {
  const root = new Container();
  const height = object.height || 92;
  const trunk = graphicsFrom((g) => {
    poly(g, [[17, height], [25, height], [22, 18], [18, 18]], '#4a3020');
    poly(g, [[20, height - 2], [24, height - 2], [21, 19], [19, 19]], '#9b6031');
    for (let y = 31; y < height; y += 13) rect(g, 18, y, 6, 2, '#684126');
  });
  const crown = new Container();
  crown.position.set(20, 18);
  const leafColors = ['#174b36', '#247044', '#348a4c', '#58a654'];
  for (let index = 0; index < 8; index += 1) {
    const side = index % 2 ? 1 : -1;
    const lane = Math.floor(index / 2);
    const leaf = graphicsFrom((g) => {
      poly(g, [[0, 0], [side * (18 + lane * 4), -10 + lane * 5], [side * (28 + lane * 3), -7 + lane * 5], [side * 6, 4]], leafColors[index % leafColors.length]);
      rect(g, side * 9, lane - 3, side * 16, 2, '#68a957');
    });
    leaf.rotation = (index - 3.5) * 0.015;
    crown.addChild(leaf);
  }
  crown.addChild(graphicsFrom((g) => {
    rect(g, -6, -1, 5, 5, '#704421');
    rect(g, 2, 1, 5, 5, '#9a612d');
  }));
  root.addChild(trunk, crown);
  return {
    view: root,
    update(time, _delta, energy, reducedMotion) {
      crown.rotation = reducedMotion ? 0 : Math.sin(time * 0.85 + object.id) * (0.018 + energy * 0.012);
    },
  };
}

function createBamboo(object) {
  const root = new Container();
  const height = object.height || 78;
  for (let index = 0; index < 6; index += 1) {
    const stem = new Container();
    stem.x = index * 6;
    const stemHeight = height - index % 3 * 8;
    stem.addChild(graphicsFrom((g) => {
      rect(g, 0, height - stemHeight, 3, stemHeight, '#4c753c');
      for (let y = height - stemHeight + 10; y < height; y += 12) rect(g, -1, y, 5, 2, '#91a951');
      rect(g, -8, height - stemHeight + 9, 9, 3, '#286441');
      rect(g, 3, height - stemHeight + 19, 10, 3, '#3e7d45');
      rect(g, -7, height - stemHeight + 29, 8, 3, '#5b954d');
    }));
    root.addChild(stem);
  }
  return {
    view: root,
    update(time, _delta, energy, reducedMotion) {
      root.skew.x = reducedMotion ? 0 : Math.sin(time * 1.2 + object.id) * (0.018 + energy * 0.015);
    },
  };
}

function createBridge(object) {
  const width = object.width || 100;
  const height = object.height || 28;
  return {
    view: graphicsFrom((g) => {
      for (let index = 0; index < 10; index += 1) {
        const rise = Math.abs(4.5 - index) * 2;
        const x = index * width / 10;
        rect(g, x, rise, width / 10 - 1, 5, '#b27138');
        rect(g, x + 3, rise + 4, 3, height - rise, '#4b3022');
      }
      rect(g, -2, 0, 4, height, '#3e291f');
      rect(g, width - 2, 0, 4, height, '#3e291f');
      rect(g, 0, 3, width, 3, '#7d4d2a');
    }),
    update() {},
  };
}

function createLotusPatch(object) {
  const root = new Container();
  const flowers = [];
  const width = object.width || 220;
  const height = object.height || 60;
  for (let index = 0; index < 14; index += 1) {
    const flower = graphicsFrom((g) => {
      rect(g, -7, 5, 15, 3, '#27694f');
      rect(g, 0, -8, 2, 14, '#3f8e5c');
      rect(g, -6, -9, 6, 5, '#df5b8c');
      rect(g, 0, -12, 6, 8, '#ff95ba');
      rect(g, 6, -8, 5, 4, '#cb477a');
      rect(g, 2, -7, 2, 2, '#ffe67d');
    });
    flower.position.set((index * 47 + 9) % width, 13 + (index * 31) % Math.max(18, height - 15));
    root.addChild(flower);
    flowers.push({ view: flower, baseY: flower.y });
  }
  return {
    view: root,
    update(time, _delta, energy, reducedMotion) {
      flowers.forEach((flower, index) => {
        flower.view.y = flower.baseY + (reducedMotion ? 0 : Math.sin(time * 1.3 + index) * (1.2 + energy));
        flower.view.rotation = reducedMotion ? 0 : Math.sin(time * 0.8 + index) * 0.025;
      });
    },
  };
}

function createOrchard(object) {
  const root = new Container();
  const trees = 10;
  for (let index = 0; index < trees; index += 1) {
    const tree = new Container();
    tree.position.set(index * ((object.width || 230) / trees), index % 2 * 9);
    tree.addChild(graphicsFrom((g) => {
      rect(g, 8, 31, 4, 44, '#5a3b25');
      rect(g, 0, 20, 23, 15, '#225d3c');
      rect(g, 4, 12, 17, 15, '#347946');
      rect(g, 8, 6, 10, 12, '#51934c');
      rect(g, 4, 25, 4, 4, '#e1aa3b');
      rect(g, 15, 17, 4, 4, '#f0c652');
    }));
    root.addChild(tree);
  }
  return {
    view: root,
    update(time, _delta, energy, reducedMotion) {
      root.children.forEach((tree, index) => {
        tree.rotation = reducedMotion ? 0 : Math.sin(time + index * 0.7) * (0.008 + energy * 0.006);
      });
    },
  };
}

function createDock(object) {
  const width = object.width || 250;
  return {
    view: graphicsFrom((g) => {
      rect(g, 0, 29, width, 9, '#5b3825');
      rect(g, 8, 22, width - 16, 8, '#ad6b33');
      for (let x = 14; x < width; x += 29) {
        rect(g, x, 38, 6, 49, '#4a3024');
        rect(g, x + 2, 39, 2, 47, '#744528');
      }
      rect(g, 0, 12, width, 2, '#493023');
      for (let x = 6; x < width; x += 36) rect(g, x, 4, 3, 25, '#493023');
    }),
    update() {},
  };
}

function createBoat(object) {
  const root = new Container();
  const scale = object.propertiesMap.scale || 1;
  root.scale.set(scale);
  root.addChild(graphicsFrom((g) => {
    poly(g, [[0, 15], [83, 15], [70, 34], [13, 34]], '#34231c');
    poly(g, [[7, 18], [76, 18], [66, 30], [16, 30]], '#95582b');
    rect(g, 20, 21, 42, 4, '#c37b3b');
    rect(g, 41, -16, 3, 31, '#4e3322');
    poly(g, [[44, -15], [75, -3], [44, 11]], '#e8b64b');
    rect(g, 10, 36, 62, 2, 'rgba(223,246,232,.42)');
  }));
  return {
    view: root,
    update(time, _delta, _energy, reducedMotion) {
      root.y = object.y + (reducedMotion ? 0 : Math.sin(time * 1.7 + (object.propertiesMap.phase || 0)) * 2);
    },
    ownsPosition: true,
  };
}

function createWorkshop(object) {
  const root = new Container();
  root.addChild(createHouse({ ...object, width: object.width || 235, height: object.height || 125, propertiesMap: { lit: true } }).view);
  root.addChild(graphicsFrom((g) => {
    rect(g, 126, 58, 93, 58, '#3d2d27');
    rect(g, 133, 65, 79, 43, '#162d3b');
    rect(g, 138, 71, 50, 3, '#5ee1cc');
    rect(g, 145, 80, 61, 3, '#efbd55');
    rect(g, 138, 89, 34, 3, '#6aaee4');
    rect(g, 182, 95, 24, 3, '#e66b4c');
  }));
  return { view: root, update() {} };
}

function createMonitor(object) {
  const root = new Container();
  const screen = graphicsFrom((g) => {
    rect(g, 0, 0, object.width || 70, object.height || 47, '#25272c');
    rect(g, 5, 5, (object.width || 70) - 10, (object.height || 47) - 12, '#123346');
  });
  const scan = graphicsFrom((g) => rect(g, 8, 0, (object.width || 70) - 18, 2, '#64ebd4'));
  root.addChild(screen, scan);
  return {
    view: root,
    update(time, _delta, energy, reducedMotion) {
      scan.y = 7 + (reducedMotion ? 8 : (time * (13 + energy * 12)) % Math.max(8, (object.height || 47) - 16));
      scan.alpha = 0.65 + Math.sin(time * 5) * 0.2;
    },
  };
}

function createTurbine(object) {
  const root = new Container();
  const height = object.height || 82;
  root.addChild(graphicsFrom((g) => {
    rect(g, 26, 26, 5, height - 26, '#6b4429');
    rect(g, 18, height - 3, 21, 4, '#3e2b22');
  }));
  const rotor = new Container();
  rotor.position.set(28, 26);
  rotor.addChild(graphicsFrom((g) => {
    for (let index = 0; index < 4; index += 1) {
      const angle = index * Math.PI / 2;
      const x = Math.cos(angle) * 18;
      const y = Math.sin(angle) * 18;
      poly(g, [[0, 0], [x + Math.cos(angle + 1.35) * 5, y + Math.sin(angle + 1.35) * 5], [x, y]], index % 2 ? '#e2c169' : '#6fb8aa');
    }
    rect(g, -4, -4, 8, 8, '#d49a42');
  }));
  root.addChild(rotor);
  return {
    view: root,
    update(time, _delta, energy, reducedMotion) {
      rotor.rotation = reducedMotion ? 0.4 : time * (1.8 + energy * 4);
    },
  };
}

function createLanternLine(object) {
  const root = new Container();
  const width = object.width || 260;
  root.addChild(graphicsFrom((g) => rect(g, 0, 0, width, 2, '#4d3025')));
  const lanterns = [];
  const colors = ['#f05a4a', '#f2b642', '#bf68dc', '#eb8240'];
  for (let index = 0; index < 8; index += 1) {
    const lantern = graphicsFrom((g) => {
      rect(g, 0, 0, 2, 13, '#583224');
      rect(g, -6, 11, 14, 3, '#6c3625');
      rect(g, -7, 14, 16, 15, colors[index % colors.length]);
      rect(g, -3, 17, 8, 9, '#ffe29a');
      rect(g, -4, 29, 10, 3, '#6c3625');
    });
    lantern.x = 14 + index * ((width - 24) / 7);
    root.addChild(lantern);
    lanterns.push(lantern);
  }
  return {
    view: root,
    update(time, _delta, energy, reducedMotion) {
      lanterns.forEach((lantern, index) => {
        lantern.y = reducedMotion ? 0 : Math.sin(time * 1.5 + index) * (1.5 + energy);
        lantern.rotation = reducedMotion ? 0 : Math.sin(time + index) * 0.02;
      });
    },
  };
}

function createKite(object) {
  const root = new Container();
  root.addChild(graphicsFrom((g) => {
    poly(g, [[18, 0], [36, 18], [18, 36], [0, 18]], '#e95750');
    poly(g, [[18, 0], [36, 18], [18, 18]], '#f4c24c');
    poly(g, [[0, 18], [18, 36], [18, 18]], '#63c8c2');
    for (let index = 0; index < 7; index += 1) rect(g, 15 - index * 6, 36 + index * 6, 9, 2, '#533328');
  }));
  return {
    view: root,
    update(time, _delta, energy, reducedMotion) {
      root.x = object.x + (reducedMotion ? 0 : Math.sin(time * 0.8) * 10 * (1 + energy * 0.4));
      root.y = object.y + (reducedMotion ? 0 : Math.cos(time) * 6 * (1 + energy * 0.4));
      root.rotation = reducedMotion ? 0 : Math.sin(time * 0.7) * 0.05;
    },
  };
}

function createFirepit() {
  const root = new Container();
  const flame = graphicsFrom((g) => {
    rect(g, 14, 8, 20, 28, '#e8532f');
    rect(g, 18, 2, 13, 27, '#ffc94f');
    rect(g, 22, 10, 6, 19, '#fff1a3');
  });
  root.addChild(graphicsFrom((g) => {
    rect(g, 0, 31, 48, 7, '#3a2922');
    rect(g, 6, 38, 36, 10, '#813b28');
  }), flame);
  return {
    view: root,
    update(time, _delta, energy, reducedMotion) {
      flame.scale.y = reducedMotion ? 0.85 : 0.72 + Math.sin(time * 13) * 0.12 + energy * 0.15;
      flame.y = 36 - flame.height;
      flame.alpha = 0.88 + Math.sin(time * 17) * 0.08;
    },
  };
}

function createMoonReflection(object) {
  const root = new Container();
  const width = object.width || 92;
  for (let index = 0; index < 9; index += 1) {
    const line = graphicsFrom((g) => rect(g, 0, 0, width - index * 8, index % 3 === 0 ? 2 : 1, '#f5e4aa'));
    line.position.set(index * 4, index * 7);
    line.alpha = 0.12 + (9 - index) * 0.025;
    root.addChild(line);
  }
  return {
    view: root,
    update(time, _delta, energy, reducedMotion) {
      root.children.forEach((line, index) => {
        line.x = index * 4 + (reducedMotion ? 0 : Math.sin(time * 1.5 + index) * (2 + energy));
      });
    },
  };
}

function createCharacter(object) {
  const variant = object.propertiesMap.variant || 'developer';
  const colors = CHARACTER_PALETTES[variant] || CHARACTER_PALETTES.developer;
  const root = new Container();
  root.scale.set(1.6);
  const shadow = graphicsFrom((g) => rect(g, -10, 2, 20, 3, 'rgba(8,14,18,.35)'));
  const backLeg = graphicsFrom((g) => {
    rect(g, -1, -1, 5, 11, '#17151a');
    rect(g, 0, 0, 3, 9, colors.trousers);
    rect(g, -1, 8, 6, 3, '#161419');
  });
  backLeg.position.set(-4, -8);
  const frontLeg = backLeg.clone();
  frontLeg.position.set(4, -8);
  const body = graphicsFrom((g) => {
    poly(g, [[-7, -23], [7, -23], [8, -10], [4, -6], [-4, -6], [-8, -10]], '#171820');
    poly(g, [[-6, -22], [6, -22], [6, -11], [3, -7], [-3, -7], [-6, -10]], colors.shirt);
    rect(g, -4, -20, 2, 10, colors.trim);
    rect(g, -4, -8, 8, 3, colors.trousers);
    rect(g, -5, -34, 11, 11, '#1a1820');
    poly(g, [[-4, -32], [4, -32], [6, -28], [3, -24], [-3, -24], [-5, -28]], '#d99a67');
    rect(g, -3, -31, 6, 2, '#efb27b');
    rect(g, -4, -34, 9, 4, '#211d23');
    rect(g, -5, -31, 2, 5, '#211d23');
    rect(g, 3, -29, 2, 2, '#53352c');
    rect(g, 2, -30, 1, 1, '#f7e4c3');
    rect(g, -8, -37, 17, 2, '#3d2a20');
    rect(g, -7, -39, 15, 3, '#8f5b2c');
    rect(g, -4, -42, 9, 4, '#c4873c');
  });
  const backArm = graphicsFrom((g) => {
    rect(g, -2, 0, 4, 11, colors.shirt);
    rect(g, -2, 9, 4, 7, '#d99a67');
    rect(g, -1, 10, 2, 4, '#efb27b');
  });
  backArm.position.set(-8, -22);
  const frontArm = backArm.clone();
  frontArm.position.set(8, -22);
  const prop = graphicsFrom((g) => {
    if (colors.prop === 'laptop' || colors.prop === 'tablet') {
      rect(g, 8, -20, 14, 10, '#172332');
      rect(g, 10, -18, 10, 6, colors.trim);
    } else if (colors.prop === 'crate' || colors.prop === 'basket') {
      rect(g, 7, -19, 13, 12, '#72452a');
      rect(g, 9, -17, 9, 3, '#c58a46');
    } else if (colors.prop === 'lantern') {
      rect(g, 10, -16, 2, 8, '#523024');
      rect(g, 7, -9, 8, 9, '#f1a83f');
      rect(g, 9, -7, 4, 5, '#ffe295');
    } else {
      rect(g, -11, -21, 4, 12, '#f2d052');
    }
  });
  root.addChild(shadow, backArm, backLeg, frontLeg, body, frontArm, prop);

  const routeWidth = object.propertiesMap.routeWidth || 0;
  const speed = (variant === 'child' ? 0.1 : 0.06) * (object.propertiesMap.speed || 1);
  const phase = object.propertiesMap.phase || object.id * 0.071;
  return {
    view: root,
    update(time, _delta, energy, reducedMotion) {
      const route = triangleWave((reducedMotion ? 0.4 : time * speed * (1 + energy * 0.6)) + phase);
      root.x = object.x + route.value * routeWidth;
      root.y = object.y - (reducedMotion ? 0 : Math.abs(Math.sin(time * 8)) * 2);
      root.scale.x = route.direction * 1.6;
      const swing = reducedMotion ? 0 : Math.sin(time * 8) * 0.34;
      backArm.rotation = swing;
      frontArm.rotation = -swing;
      backLeg.rotation = -swing * 0.65;
      frontLeg.rotation = swing * 0.65;
    },
    ownsPosition: true,
  };
}

function createDuck(object) {
  const root = new Container();
  root.scale.set(1.45);
  const body = graphicsFrom((g) => {
    poly(g, [[-10, -6], [-5, -10], [6, -9], [10, -5], [7, 0], [-6, 1], [-11, -2]], '#30251e');
    poly(g, [[-8, -6], [-4, -8], [5, -8], [8, -4], [5, -1], [-5, 0], [-9, -2]], '#8b6030');
    poly(g, [[-6, -6], [0, -7], [5, -4], [0, -1], [-5, -2]], '#c4914a');
    rect(g, 3, -13, 6, 7, '#26694f');
    rect(g, 5, -12, 4, 3, '#54a17b');
    rect(g, 8, -9, 5, 2, '#e6ad35');
    rect(g, 7, -11, 1, 1, '#17191a');
    rect(g, -9, -6, 3, 2, '#ded1a6');
  });
  root.addChild(body);
  const routeWidth = object.propertiesMap.routeWidth || 90;
  const phase = object.propertiesMap.phase || object.id * 0.1;
  return {
    view: root,
    update(time, _delta, energy, reducedMotion) {
      const route = triangleWave((reducedMotion ? 0.2 : time * 0.055 * (1 + energy)) + phase);
      root.x = object.x + route.value * routeWidth;
      root.y = object.y + (reducedMotion ? 0 : Math.sin(time * 2.6 + phase) * 1.5);
      root.scale.x = route.direction * 1.45;
    },
    ownsPosition: true,
  };
}

function createBuffalo(object) {
  const root = new Container();
  root.scale.set(1.3);
  const legs = new Container();
  const legA = graphicsFrom((g) => { rect(g, -2, 0, 5, 13, '#292522'); rect(g, -3, 11, 7, 3, '#161718'); });
  const legB = legA.clone();
  legA.x = -9;
  legB.x = 8;
  legs.addChild(legA, legB);
  const body = graphicsFrom((g) => {
    poly(g, [[-18, -18], [-11, -23], [9, -22], [17, -16], [14, -4], [7, 0], [-12, -1], [-19, -7]], '#282522');
    poly(g, [[-15, -17], [-9, -20], [8, -19], [14, -15], [11, -6], [5, -3], [-11, -4], [-16, -8]], '#4b4038');
    rect(g, -10, -18, 12, 4, '#68564a');
    poly(g, [[10, -19], [15, -25], [23, -24], [27, -17], [24, -10], [15, -9], [10, -13]], '#4d423a');
    rect(g, 21, -20, 2, 2, '#111516');
    poly(g, [[15, -24], [8, -29], [5, -27], [12, -21]], '#d7c39b');
    poly(g, [[22, -24], [29, -30], [33, -28], [25, -20]], '#d7c39b');
    rect(g, -22, -17, 5, 3, '#332b27');
  });
  root.addChild(legs, body);
  const routeWidth = object.propertiesMap.routeWidth || 100;
  return {
    view: root,
    update(time, _delta, energy, reducedMotion) {
      const route = triangleWave((reducedMotion ? 0.3 : time * 0.026 * (1 + energy * 0.5)) + object.id * 0.03);
      root.x = object.x + route.value * routeWidth;
      root.y = object.y;
      root.scale.x = route.direction * 1.3;
      const stride = reducedMotion ? 0 : Math.sin(time * 3.4) * 0.18;
      legA.rotation = stride;
      legB.rotation = -stride;
    },
    ownsPosition: true,
  };
}

function createChicken(object) {
  const root = new Container();
  root.scale.set(1.45);
  const head = graphicsFrom((g) => {
    rect(g, 3, -13, 7, 8, '#d66b31');
    rect(g, 8, -9, 5, 2, '#f2bf3e');
    rect(g, 5, -15, 3, 3, '#df3d35');
    rect(g, 8, -12, 1, 1, '#171719');
  });
  const body = graphicsFrom((g) => {
    poly(g, [[-9, -9], [-4, -12], [4, -10], [7, -5], [4, 0], [-6, 0], [-10, -4]], '#bd542d');
    poly(g, [[-6, -9], [0, -9], [4, -5], [-2, -2], [-7, -4]], '#e0813b');
    poly(g, [[-8, -10], [-13, -14], [-12, -7], [-16, -10], [-12, -3]], '#713025');
    rect(g, -4, 0, 2, 5, '#b36b2e');
    rect(g, 3, 0, 2, 5, '#b36b2e');
  });
  root.addChild(body, head);
  const routeWidth = object.propertiesMap.routeWidth || 90;
  return {
    view: root,
    update(time, _delta, energy, reducedMotion) {
      const route = triangleWave((reducedMotion ? 0.2 : time * 0.083 * (1 + energy)) + object.id * 0.08);
      root.x = object.x + route.value * routeWidth;
      root.y = object.y;
      root.scale.x = route.direction * 1.45;
      head.y = reducedMotion ? 0 : (Math.floor(time * 2.4) % 4 === 0 ? 4 : 0);
    },
    ownsPosition: true,
  };
}

function createDog(object) {
  const root = new Container();
  root.scale.set(1.45);
  const tail = graphicsFrom((g) => poly(g, [[-12, -10], [-19, -17], [-21, -14], [-15, -8]], '#81502e'));
  const legs = graphicsFrom((g) => {
    rect(g, -6, -3, 4, 10, '#74482a');
    rect(g, 4, -3, 4, 10, '#74482a');
    rect(g, -7, 5, 6, 3, '#34251f');
    rect(g, 3, 5, 6, 3, '#34251f');
  });
  const body = graphicsFrom((g) => {
    poly(g, [[-10, -11], [-5, -14], [7, -13], [11, -8], [8, -2], [-7, -2], [-11, -6]], '#ae7139');
    rect(g, -5, -12, 8, 4, '#d49a53');
    poly(g, [[6, -12], [10, -18], [16, -17], [19, -12], [16, -7], [9, -7]], '#c78643');
    poly(g, [[9, -17], [10, -21], [14, -17]], '#68422b');
    rect(g, 15, -15, 1, 1, '#171719');
    rect(g, 18, -12, 4, 2, '#33251e');
    rect(g, 8, -11, 3, 5, '#f0c47d');
  });
  root.addChild(tail, legs, body);
  const routeWidth = object.propertiesMap.routeWidth || 110;
  const speed = 0.076 * (object.propertiesMap.speed || 1);
  return {
    view: root,
    update(time, _delta, energy, reducedMotion) {
      const route = triangleWave((reducedMotion ? 0.2 : time * speed * (1 + energy)) + object.id * 0.05);
      root.x = object.x + route.value * routeWidth;
      root.y = object.y - (reducedMotion ? 0 : Math.abs(Math.sin(time * 9)) * 2);
      root.scale.x = route.direction * 1.45;
      tail.rotation = reducedMotion ? 0 : Math.sin(time * 8) * 0.28;
    },
    ownsPosition: true,
  };
}

function createCat(object) {
  const root = new Container();
  root.scale.set(1.5);
  const tail = graphicsFrom((g) => {
    rect(g, 5, -10, 4, 11, '#b9864b');
    rect(g, 8, -13, 6, 4, '#d8ab65');
  });
  const body = graphicsFrom((g) => {
    poly(g, [[-6, -11], [-3, -15], [5, -14], [8, -9], [5, 0], [-5, 0], [-8, -6]], '#d1a15d');
    poly(g, [[-6, -15], [-5, -20], [-1, -16], [3, -16], [6, -20], [7, -14], [5, -11], [-4, -11]], '#ddb26b');
    rect(g, -2, -14, 1, 2, '#173849');
    rect(g, 4, -14, 1, 2, '#173849');
    rect(g, 1, -12, 2, 1, '#7c4b45');
    rect(g, -3, -9, 2, 7, '#ad7d43');
    rect(g, 3, -9, 2, 7, '#ad7d43');
  });
  root.addChild(tail, body);
  return {
    view: root,
    update(time, _delta, energy, reducedMotion) {
      tail.rotation = reducedMotion ? 0 : Math.sin(time * 3) * (0.22 + energy * 0.1);
      root.y = object.y + (reducedMotion ? 0 : Math.sin(time * 1.4) * 0.6);
    },
    ownsPosition: true,
  };
}

const FACTORIES = {
  house: createHouse,
  palm: createPalm,
  bamboo: createBamboo,
  bridge: createBridge,
  lotusPatch: createLotusPatch,
  orchard: createOrchard,
  dock: createDock,
  boat: createBoat,
  workshop: createWorkshop,
  monitor: createMonitor,
  turbine: createTurbine,
  lanternLine: createLanternLine,
  kite: createKite,
  firepit: createFirepit,
  moonReflection: createMoonReflection,
  character: createCharacter,
  duck: createDuck,
  buffalo: createBuffalo,
  chicken: createChicken,
  dog: createDog,
  cat: createCat,
};

export function createPixelArtObject(object) {
  const objectClass = getObjectClass(object);
  const factory = FACTORIES[objectClass];
  if (!factory) return null;

  const asset = factory(object);
  asset.view.position.set(object.x, object.y);
  asset.view.label = object.name || `${objectClass}-${object.id}`;
  asset.view.roundPixels = true;
  return { ...asset, objectClass, source: object };
}
