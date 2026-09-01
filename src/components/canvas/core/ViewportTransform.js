/**
 * ViewportTransform.js
 * Single source of truth for converting between Screen Space and Virtual World Space.
 * Provides integer/cover scaling, DPR normalization, and context transform application.
 */

export class ViewportTransform {
  constructor(virtualWidth = 640, virtualHeight = 360) {
    this.virtualWidth = virtualWidth;
    this.virtualHeight = virtualHeight;

    this.viewportWidth = 0;
    this.viewportHeight = 0;
    this.devicePixelRatio = 1;

    this.scale = 1;
    this.drawWidth = virtualWidth;
    this.drawHeight = virtualHeight;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  /**
   * Recalculate cover scale and centering offset upon viewport resize
   */
  resize({ viewportWidth, viewportHeight, devicePixelRatio = 1 }) {
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
    this.devicePixelRatio = Math.min(devicePixelRatio || 1, 2);

    // Cover scale: ensure virtual world fills the entire viewport without stretching
    this.scale = Math.max(
      this.viewportWidth / this.virtualWidth,
      this.viewportHeight / this.virtualHeight
    );

    this.drawWidth = Math.round(this.virtualWidth * this.scale);
    this.drawHeight = Math.round(this.virtualHeight * this.scale);

    this.offsetX = Math.floor((this.viewportWidth - this.drawWidth) / 2);
    this.offsetY = Math.floor((this.viewportHeight - this.drawHeight) / 2);
  }

  getScale() {
    return this.scale;
  }

  getOffset() {
    return { x: this.offsetX, y: this.offsetY };
  }

  getVirtualSize() {
    return { width: this.virtualWidth, height: this.virtualHeight };
  }

  getViewportSize() {
    return { width: this.viewportWidth, height: this.viewportHeight };
  }

  /**
   * Apply DPR and Cover Scale transform to 2D Canvas context
   */
  applyToContext(ctx) {
    // 1. Reset hardware transform
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // 2. Scale for Device Pixel Ratio (Retina / High-DPI screens)
    ctx.scale(this.devicePixelRatio, this.devicePixelRatio);

    // 3. Shift and scale into Virtual World Space
    ctx.translate(this.offsetX, this.offsetY);
    ctx.scale(this.scale, this.scale);

    // 4. Enforce crisp pixel art rendering
    ctx.imageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
  }

  /**
   * Reset context back to pure Screen Space (DPR-scaled only)
   */
  applyScreenSpace(ctx) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(this.devicePixelRatio, this.devicePixelRatio);
    ctx.imageSmoothingEnabled = false;
  }

  /**
   * Convert Screen coordinate to Virtual World coordinate
   */
  screenToWorld(sx, sy, cameraPos, parallaxFactor = 1.0) {
    const vx = (sx - this.offsetX) / this.scale;
    const vy = (sy - this.offsetY) / this.scale;

    const layerCamX = cameraPos.x * parallaxFactor;
    const layerCamY = cameraPos.y * parallaxFactor;

    const centerX = this.virtualWidth / 2;
    const centerY = this.virtualHeight / 2;

    return {
      x: vx - (centerX - layerCamX),
      y: vy - (centerY - layerCamY),
    };
  }

  /**
   * Convert Virtual World coordinate to Screen coordinate
   */
  worldToScreen(wx, wy, cameraPos, parallaxFactor = 1.0) {
    const layerCamX = cameraPos.x * parallaxFactor;
    const layerCamY = cameraPos.y * parallaxFactor;

    const centerX = this.virtualWidth / 2;
    const centerY = this.virtualHeight / 2;

    const vx = wx + (centerX - layerCamX);
    const vy = wy + (centerY - layerCamY);

    return {
      x: Math.round(vx * this.scale + this.offsetX),
      y: Math.round(vy * this.scale + this.offsetY),
    };
  }
}

export const viewportTransform = new ViewportTransform(640, 360);
