/**
 * ParallaxCompositor: Multi-layer rendering engine with strict Object Culling.
 * Operates in Virtual World Space (640x360 base resolution).
 */

const CULL_MARGIN = 256;

export class ParallaxCompositor {
  constructor() {
    this.stats = {
      totalObjects: 0,
      renderedObjects: 0,
      culledObjects: 0,
    };
    this.layerVisibility = {
      layer_far_sky: true,
      layer_far_landscape: true,
      layer_mid_ground: true,
      layer_main_world: true,
      layer_foreground: true,
    };
    this.showAnchors = false;
  }

  setLayerVisibility(layerId, isVisible) {
    this.layerVisibility[layerId] = isVisible;
  }

  setAnchorVisibility(show) {
    this.showAnchors = show;
  }

  resetStats() {
    this.stats.totalObjects = 0;
    this.stats.renderedObjects = 0;
    this.stats.culledObjects = 0;
  }

  /**
   * Render a scene layer using its specific camera parallax factor and virtual viewport culling
   */
  renderLayer(ctx, layerDef, objects, cameraPos, virtualWidth, virtualHeight, time, reducedMotion = false) {
    if (this.layerVisibility[layerDef.id] === false) {
      return;
    }

    const factor = layerDef.cameraFactor;
    // Layer-specific camera offset
    const layerCamX = cameraPos.x * factor;
    const layerCamY = cameraPos.y * factor;

    // Virtual Center offset
    const centerX = virtualWidth / 2;
    const centerY = virtualHeight / 2;

    ctx.save();
    // Transform coordinates for this parallax layer
    ctx.translate(Math.round(centerX - layerCamX), Math.round(centerY - layerCamY));

    for (let i = 0; i < objects.length; i++) {
      const obj = objects[i];
      if (obj.visible === false) continue;

      this.stats.totalObjects++;

      // Compute virtual bounding box to perform viewport culling
      const scaleMultiplier = obj.scale || 1;
      const spriteW = obj.width * scaleMultiplier;
      const spriteH = obj.height * scaleMultiplier;
      const anchorX = (obj.anchorX !== undefined ? obj.anchorX : obj.width / 2) * scaleMultiplier;
      const anchorY = (obj.anchorY !== undefined ? obj.anchorY : obj.height / 2) * scaleMultiplier;

      const worldX = obj.x - anchorX;
      const worldY = obj.y - anchorY;

      const screenX = worldX + (centerX - layerCamX);
      const screenY = worldY + (centerY - layerCamY);

      // Culling Check: Discard objects outside virtual viewport + overscan margin
      if (
        screenX + spriteW < -CULL_MARGIN ||
        screenX > virtualWidth + CULL_MARGIN ||
        screenY + spriteH < -CULL_MARGIN ||
        screenY > virtualHeight + CULL_MARGIN
      ) {
        this.stats.culledObjects++;
        continue;
      }

      this.stats.renderedObjects++;

      // Render the sprite using its cached canvas or custom procedure
      if (obj.cachedCanvas) {
        ctx.drawImage(
          obj.cachedCanvas,
          Math.round(worldX),
          Math.round(worldY),
          Math.round(spriteW),
          Math.round(spriteH)
        );
      } else if (typeof obj.customRender === 'function') {
        obj.customRender(ctx, worldX, worldY, spriteW, spriteH, time, reducedMotion);
      }

      // Draw debug anchor point if enabled
      if (this.showAnchors) {
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(Math.round(obj.x) - 2, Math.round(obj.y) - 2, 4, 4);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(Math.round(worldX), Math.round(worldY), Math.round(spriteW), Math.round(spriteH));
      }
    }

    ctx.restore();
  }
}
