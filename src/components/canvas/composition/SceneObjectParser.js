import { spriteCache } from '../core/SpriteCache';
import { SPRITE_MANIFEST } from '../data/spriteManifest';

/**
 * Maps the new configuration schema to the engine's Layer objects
 */
export function parseSceneObjects(config, time, reducedMotion, progress) {
  const layers = {
    layer_far_sky: [],
    layer_far_landscape: [],
    layer_mid_ground: [],
    layer_main_world: [],
    layer_foreground: []
  };

  const { objects, worldBounds } = config;
  
  objects.forEach(obj => {
    // 1. Layer Mapping
    let layerId = 'layer_main_world';
    if (obj.layer === 'background') layerId = 'layer_far_landscape';
    if (obj.layer === 'mid') layerId = 'layer_mid_ground';
    if (obj.layer === 'foreground') layerId = 'layer_foreground';

    // 2. Fetch Sprite Metadata
    const manifestDef = SPRITE_MANIFEST.find(m => m.key === obj.asset);
    if (!manifestDef) {
       console.warn(`[SceneObjectParser] Asset not found in manifest: ${obj.asset}`);
       return;
    }


    // 3. Perfect Reverse Parallax Normalization
    // We want the object to appear at TargetScreenX and TargetScreenY when the camera reaches the proportional point in the scene!
    
    // Calculate layer factor
    let layerFactor = 1.0;
    if (layerId === 'layer_far_landscape') layerFactor = 0.25;
    if (layerId === 'layer_mid_ground') layerFactor = 0.60;
    if (layerId === 'layer_foreground') layerFactor = 1.12;

    const cameraY = worldBounds.y; // We will pass exact camera Y in worldBounds.y
    const centerY = 180;
    // Y reverse-projection:
    const targetScreenY = (obj.y / 100) * 360;
    const worldY_base = targetScreenY - (centerY - cameraY * layerFactor);

    // X mapping: Simple physical world coordinate
    // The user's obj.x maps directly to the physical world bounds defined for the scene
    const worldX_base = worldBounds.x + (obj.x / 100) * worldBounds.width;

    // 4. Calculate Anchors and Size
    const scale = obj.scale || 1;
    let anchorX = manifestDef.anchorX !== undefined ? manifestDef.anchorX : manifestDef.width / 2;
    let anchorY = manifestDef.anchorY !== undefined ? manifestDef.anchorY : manifestDef.height / 2;

    if (obj.anchor === 'center') {
       anchorX = manifestDef.width / 2;
       anchorY = manifestDef.height / 2;
    } else if (obj.anchor === 'bottom-center') {
       anchorX = manifestDef.width / 2;
       anchorY = manifestDef.height;
    }

    // 5. Build Render Object
    layers[layerId].push({
      id: obj.id,
      x: worldX_base + anchorX,
      y: worldY_base + anchorY,
      width: manifestDef.width,
      height: manifestDef.height,
      anchorX: anchorX,
      anchorY: anchorY,
      scale: scale,
      visible: true,
      customRender: (ctx, wx, wy, w, h, globalTime, isReduced) => {
        // Handle Reveal/Exit based on progress
        if (obj.reveal && progress < obj.reveal[0]) return;
        if (obj.exit && progress > obj.exit[1]) return;

        // Fetch Frame
        let frame = 0;
        if (manifestDef.animated && !isReduced) {
            frame = Math.floor(globalTime * 5); 
        }

        const sprite = spriteCache.get(obj.asset, frame);
        if (sprite) {
          ctx.drawImage(sprite, Math.round(wx), Math.round(wy), Math.round(w), Math.round(h));
        }
      }
    });
  });

  return layers;
}
