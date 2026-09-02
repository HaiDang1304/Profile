import { Container, Graphics } from 'pixi.js';
import { SCENE_BY_ID } from '../../data/sceneLayout';
import { createPixelArtObject } from '../art/PixelArtFactory';
import { flattenObjectLayers, tiledProperties, validateTiledWorld } from '../tiled/tiledUtils';

const BACKDROP_WIDTH = 1280;
const BACKDROP_HEIGHT = 520;

function rect(graphics, x, y, width, height, color) {
  graphics.rect(Math.round(x), Math.round(y), Math.round(width), Math.round(height)).fill(color);
}

function poly(graphics, points, color) {
  graphics.poly(points.flatMap(([x, y]) => [Math.round(x), Math.round(y)])).fill(color);
}

function createBandSky(palette) {
  const graphics = new Graphics();
  rect(graphics, -640, -260, BACKDROP_WIDTH, 202, palette.skyTop);
  rect(graphics, -640, -196, BACKDROP_WIDTH, 70, palette.skyBottom);
  rect(graphics, -640, -126, BACKDROP_WIDTH, 69, palette.skyBottom);
  for (let y = -218; y < -62; y += 13) {
    for (let x = -630 + ((y * 7) % 29); x < 630; x += 47) rect(graphics, x, y, 4 + Math.abs(x % 5), 2, palette.accent);
  }
  graphics.alpha = 0.98;
  return graphics;
}

function createCelestial(sceneId, palette, artSide) {
  const root = new Container();
  const celestial = new Graphics();
  const x = artSide === 'right' ? 235 : -235;
  const y = -124;
  const night = sceneId === 'contact';
  if (night) {
    for (let index = 0; index < 58; index += 1) {
      const sx = -610 + (index * 113) % 1220;
      const sy = -245 + (index * 47) % 145;
      rect(celestial, sx, sy, index % 9 === 0 ? 3 : 2, index % 9 === 0 ? 3 : 2, index % 6 ? '#f8eac0' : '#a9d3ec');
    }
  }
  for (let row = -17; row <= 17; row += 3) {
    const half = Math.floor(Math.sqrt(Math.max(0, 17 * 17 - row * row)));
    rect(celestial, x - half, y + row, half * 2 + 1, 3, palette.accent);
  }
  if (night) {
    for (let row = -13; row <= 13; row += 3) {
      const half = Math.floor(Math.sqrt(Math.max(0, 13 * 13 - row * row)));
      rect(celestial, x + 8 - half, y - 5 + row, half * 2 + 1, 3, palette.skyTop);
    }
  }
  root.addChild(celestial);
  return root;
}

function createCloud(x, y, scale, colors) {
  const graphics = new Graphics();
  rect(graphics, 7 * scale, 5 * scale, 35 * scale, 7 * scale, colors[0]);
  rect(graphics, 14 * scale, 0, 22 * scale, 9 * scale, colors[0]);
  rect(graphics, 24 * scale, -5 * scale, 12 * scale, 9 * scale, colors[0]);
  rect(graphics, 0, 9 * scale, 50 * scale, 6 * scale, colors[0]);
  rect(graphics, 11 * scale, 15 * scale, 30 * scale, 3 * scale, colors[1]);
  rect(graphics, 19 * scale, 18 * scale, 17 * scale, 2 * scale, colors[1]);
  graphics.position.set(x, y);
  return graphics;
}

function createFarLandscape(palette) {
  const graphics = new Graphics();
  poly(graphics, [[-650, -57], [-574, -123], [-507, -74], [-429, -143], [-338, -69], [-247, -128], [-151, -66], [-42, -151], [64, -68], [157, -131], [250, -71], [345, -141], [437, -69], [529, -125], [650, -60], [650, 12], [-650, 12]], palette.land);
  for (let x = -650; x < 660; x += 25) {
    const height = 28 + Math.abs((x * 11) % 22);
    poly(graphics, [[x - 14, -51], [x, -51 - height], [x + 15, -51]], '#164536');
    rect(graphics, x - 2, -53, 4, 35, '#24533e');
  }
  return graphics;
}

function createWater(palette) {
  const root = new Container();
  const water = new Graphics();
  rect(water, -640, -58, BACKDROP_WIDTH, 318, palette.water);
  rect(water, -640, 42, BACKDROP_WIDTH, 218, '#25566b');
  rect(water, -640, 142, BACKDROP_WIDTH, 118, '#1c4056');
  root.addChild(water);
  const ripples = [];
  for (let index = 0; index < 48; index += 1) {
    const ripple = new Graphics();
    const width = 14 + index % 7 * 7;
    rect(ripple, 0, 0, width, index % 8 === 0 ? 2 : 1, index % 3 ? 'rgba(164,220,216,.32)' : 'rgba(255,237,174,.35)');
    ripple.position.set(-620 + (index * 97) % 1240, -39 + (index * 43) % 279);
    root.addChild(ripple);
    ripples.push({ view: ripple, originX: ripple.x, speed: 2 + index % 5 });
  }
  return { root, ripples };
}

function createArtBank(artSide, palette) {
  const graphics = new Graphics();
  const left = artSide === 'right' ? 25 : -635;
  const right = artSide === 'right' ? 635 : -25;
  poly(graphics, [[left, 91], [right, 84], [right, 260], [left, 260]], '#674028');
  rect(graphics, left, 83, right - left, 12, palette.land);
  rect(graphics, left + 22, 107, right - left - 44, 6, '#8d572e');
  rect(graphics, left + 8, 147, right - left - 20, 5, '#4f3527');
  for (let x = left + 11; x < right; x += 23) {
    const height = 8 + Math.abs((x * 3) % 14);
    rect(graphics, x, 83 - height, 3, height + 2, '#4e853e');
    rect(graphics, x - 5, 85 - height, 7, 3, '#6da04a');
  }
  return graphics;
}

function createBackdrop(sceneId, palette, artSide) {
  const layers = {
    farSky: new Container(),
    farLandscape: new Container(),
    midGround: new Container(),
    mainWorld: new Container(),
    foreground: new Container(),
  };

  layers.farSky.label = `${sceneId}:far-sky`;
  layers.farLandscape.label = `${sceneId}:far-landscape`;
  layers.midGround.label = `${sceneId}:mid-ground`;
  layers.mainWorld.label = `${sceneId}:main-world`;
  layers.foreground.label = `${sceneId}:foreground`;

  layers.farSky.addChild(createBandSky(palette), createCelestial(sceneId, palette, artSide));
  const cloudColors = sceneId === 'contact' ? ['#314967', '#213956'] : sceneId === 'playground' ? ['#db9687', '#a96370'] : ['#f3ead5', '#bdc3b5'];
  const clouds = [];
  for (let index = 0; index < 5; index += 1) {
    const cloud = createCloud(-570 + index * 278, -202 + index * 23, 0.7 + index * 0.08, cloudColors);
    layers.farSky.addChild(cloud);
    clouds.push({ view: cloud, speed: 2.2 + index * 0.6, startX: cloud.x });
  }
  layers.farLandscape.addChild(createFarLandscape(palette));
  const { root: water, ripples } = createWater(palette);
  layers.midGround.addChild(water);
  layers.mainWorld.addChild(createArtBank(artSide, palette));

  const foreground = new Graphics();
  rect(foreground, -640, 245, BACKDROP_WIDTH, 15, 'rgba(8,24,25,.35)');
  layers.foreground.addChild(foreground);

  return { layers, clouds, ripples };
}

function createSceneRecord(group) {
  const properties = tiledProperties(group.properties);
  const sceneId = properties.sceneId;
  const layout = SCENE_BY_ID[sceneId];
  if (!layout) throw new Error(`Tiled scene '${sceneId}' is missing from sceneLayout.`);

  const palette = {
    skyTop: properties.skyTop,
    skyBottom: properties.skyBottom,
    water: properties.water,
    land: properties.land,
    accent: properties.accent,
  };
  const scene = new Container();
  scene.label = `scene:${sceneId}`;
  scene.position.set(group.offsetx || 0, group.offsety || 0);
  scene.sortableChildren = true;

  const backdrop = createBackdrop(sceneId, palette, layout.artSide);
  const layerOrder = [backdrop.layers.farSky, backdrop.layers.farLandscape, backdrop.layers.midGround, backdrop.layers.mainWorld, backdrop.layers.foreground];
  layerOrder.forEach((layer, index) => {
    layer.zIndex = index * 100;
    scene.addChild(layer);
  });

  const updates = [];
  for (const object of flattenObjectLayers(group)) {
    const asset = createPixelArtObject(object);
    if (!asset) continue;
    const targetLayer = object.sourceLayer === 'entities' ? backdrop.layers.foreground : backdrop.layers.mainWorld;
    asset.view.zIndex = 20 + Math.round(object.y);
    targetLayer.addChild(asset.view);
    updates.push(asset.update);
  }

  return {
    id: sceneId,
    view: scene,
    anchor: { x: group.offsetx || 0, y: group.offsety || 0 },
    layers: backdrop.layers,
    clouds: backdrop.clouds,
    ripples: backdrop.ripples,
    updates,
  };
}

export function buildTiledWorld(mapData) {
  const groups = validateTiledWorld(mapData);
  const root = new Container();
  root.label = 'tiled-world';
  root.sortableChildren = true;
  const scenes = new Map();

  for (const group of groups) {
    const scene = createSceneRecord(group);
    scene.view.zIndex = scene.anchor.y;
    root.addChild(scene.view);
    scenes.set(scene.id, scene);
  }

  return { root, scenes };
}
