import { cameraPath, sampleCameraPath } from '../data/cameraPath';

export class Camera2D {
  constructor() {
    this.x = cameraPath[0].x;
    this.y = cameraPath[0].y;
    this.targetX = cameraPath[0].x;
    this.targetY = cameraPath[0].y;
    this.damping = 8.0; // Responsive delta-time based damping factor
    this.reducedMotion = false;
  }

  /**
   * Calculates smooth interpolated world position for a given scroll progress [0, 1]
   */
  getTargetForProgress(progress) {
    return sampleCameraPath(progress, this.reducedMotion);
  }

  setReducedMotion(reducedMotion) {
    this.reducedMotion = reducedMotion;
  }

  /**
   * Update target position based on progress
   */
  updateTarget(progress) {
    const pos = this.getTargetForProgress(progress);
    this.targetX = pos.x;
    this.targetY = pos.y;
  }

  /**
   * Delta-time based exponential damping (frame-rate independent)
   */
  tick(deltaTime) {
    const alpha = 1 - Math.exp(-this.damping * deltaTime);
    this.x += (this.targetX - this.x) * alpha;
    this.y += (this.targetY - this.y) * alpha;
  }

  /**
   * Pixel-snapped coordinates to prevent subpixel jittering
   */
  getRenderPosition() {
    return {
      x: Math.round(this.x),
      y: Math.round(this.y),
      rawX: this.x,
      rawY: this.y,
      targetX: this.targetX,
      targetY: this.targetY,
    };
  }

  /**
   * Instant snap without damping (used on initial mount / resize)
   */
  snapTo(progress) {
    this.updateTarget(progress);
    this.x = this.targetX;
    this.y = this.targetY;
  }
}
