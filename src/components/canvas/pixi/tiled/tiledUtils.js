export function tiledProperties(entries = []) {
  return Object.fromEntries(entries.map((entry) => [entry.name, entry.value]));
}

export function getObjectClass(object) {
  return object.class || object.type || '';
}

export function flattenObjectLayers(group) {
  const result = [];

  function visit(layer, parentOffsetX = 0, parentOffsetY = 0) {
    const offsetX = parentOffsetX + (layer.offsetx || 0);
    const offsetY = parentOffsetY + (layer.offsety || 0);

    if (layer.type === 'objectgroup') {
      for (const object of layer.objects || []) {
        result.push({
          ...object,
          x: object.x + offsetX,
          y: object.y + offsetY,
          sourceLayer: layer.name,
          propertiesMap: tiledProperties(object.properties),
        });
      }
    }

    for (const child of layer.layers || []) visit(child, offsetX, offsetY);
  }

  for (const layer of group.layers || []) visit(layer);
  return result;
}

export function validateTiledWorld(map) {
  if (!map || map.type !== 'map') throw new Error('Tiled world must be a valid JSON map.');
  if (map.orientation !== 'orthogonal') throw new Error('Only orthogonal Tiled maps are supported.');

  const groups = (map.layers || []).filter((layer) => layer.type === 'group');
  if (groups.length !== 6) throw new Error(`Expected six Tiled scene groups, received ${groups.length}.`);

  const sceneIds = groups.map((group) => tiledProperties(group.properties).sceneId);
  if (new Set(sceneIds).size !== groups.length) throw new Error('Every Tiled scene group needs a unique sceneId property.');
  return groups;
}
