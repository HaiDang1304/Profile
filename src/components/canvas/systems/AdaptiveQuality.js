/**
 * AdaptiveQuality.js
 * Automatically adapts particle load based on frame execution time with hysteresis.
 * Prevents frame drops on lower-powered devices without affecting virtual resolution.
 */

export class AdaptiveQuality {
  constructor() {
    this.qualityLevel = 'HIGH'; // 'HIGH' | 'MEDIUM' | 'LOW'
    this.budgetMultiplier = 1.0;

    this.sampleWindow = 60; // ~1-2 seconds of frame samples
    this.samples = new Float32Array(this.sampleWindow);
    this.sampleIndex = 0;
    this.sampleCount = 0;
    this.lastEvaluationTime = 0;
    this.evaluationInterval = 2500; // Evaluate every 2.5s to prevent flapping
    this.averageFrameTime = 16.6;
  }

  recordFrame(deltaTimeMs, currentTimeMs) {
    this.samples[this.sampleIndex] = deltaTimeMs;
    this.sampleIndex = (this.sampleIndex + 1) % this.sampleWindow;
    if (this.sampleCount < this.sampleWindow) {
      this.sampleCount++;
    }

    // Check evaluation threshold
    if (currentTimeMs - this.lastEvaluationTime >= this.evaluationInterval && this.sampleCount >= 20) {
      this.evaluate(currentTimeMs);
    }
  }

  evaluate(now) {
    this.lastEvaluationTime = now;
    let sum = 0;
    for (let i = 0; i < this.sampleCount; i++) {
      sum += this.samples[i];
    }
    this.averageFrameTime = sum / this.sampleCount;

    // Hysteresis thresholds
    // High: < 19ms (> 52 FPS)
    // Medium: 19ms - 27ms (37 - 52 FPS)
    // Low: > 27ms (< 37 FPS)
    if (this.qualityLevel === 'HIGH') {
      if (this.averageFrameTime > 21.0) {
        this.qualityLevel = 'MEDIUM';
        this.budgetMultiplier = 0.7;
      }
    } else if (this.qualityLevel === 'MEDIUM') {
      if (this.averageFrameTime > 27.0) {
        this.qualityLevel = 'LOW';
        this.budgetMultiplier = 0.4;
      } else if (this.averageFrameTime < 17.5) {
        this.qualityLevel = 'HIGH';
        this.budgetMultiplier = 1.0;
      }
    } else if (this.qualityLevel === 'LOW') {
      if (this.averageFrameTime < 22.0) {
        this.qualityLevel = 'MEDIUM';
        this.budgetMultiplier = 0.7;
      }
    }
  }

  getMultiplier() {
    return this.budgetMultiplier;
  }

  getQualityLevel() {
    return this.qualityLevel;
  }

  getAverageFrameTime() {
    return Math.round(this.averageFrameTime * 10) / 10;
  }

  getDeviceBudget(baseBudgets, isMobile, isTablet, reducedMotion) {
    if (reducedMotion) {
      return baseBudgets.reducedMotion;
    }
    let base = baseBudgets.desktop;
    if (isMobile) {
      base = baseBudgets.mobile;
    } else if (isTablet) {
      base = baseBudgets.tablet;
    }
    return Math.max(4, Math.round(base * this.budgetMultiplier));
  }
}
