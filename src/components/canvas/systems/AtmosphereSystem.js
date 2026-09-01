/**
 * AtmosphereSystem.js
 * Master orchestrator for global atmosphere particles across the portfolio world.
 * Manages object pooling, adaptive budgeting, scene blending, and delta-time updates.
 */

import { ParticlePool } from './ParticlePool';
import { AdaptiveQuality } from './AdaptiveQuality';
import { PARTICLE_BUDGET, getBlendedProfile } from '../data/atmosphereProfiles';

import { CloudField } from '../atmosphere/CloudField';
import { LeafField } from '../atmosphere/LeafField';
import { LightMotes } from '../atmosphere/LightMotes';
import { FireflyField } from '../atmosphere/FireflyField';
import { StarField } from '../atmosphere/StarField';
import { SmokeField } from '../atmosphere/SmokeField';

export class AtmosphereSystem {
  constructor() {
    this.pool = new ParticlePool(160);
    this.quality = new AdaptiveQuality();

    this.fields = {
      clouds: new CloudField(),
      leaves: new LeafField(),
      lightMotes: new LightMotes(),
      fireflies: new FireflyField(),
      stars: new StarField(),
      smoke: new SmokeField(),
    };

    // Effect toggle overrides (for AtmosphereDebugger)
    this.enabledEffects = {
      clouds: true,
      leaves: true,
      lightMotes: true,
      fireflies: true,
      stars: true,
      smoke: true,
    };

    this.lastProfile = null;
    this.seedCounter = 1;
    this.isHidden = false;

    // Device categorization
    this.isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    this.isTablet = typeof window !== 'undefined' && window.innerWidth >= 640 && window.innerWidth < 1024;

    if (typeof document !== 'undefined') {
      this.handleVisibility = () => {
        this.isHidden = document.hidden;
      };
      this.handleResize = () => {
        this.isMobile = window.innerWidth < 640;
        this.isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
      };
      document.addEventListener('visibilitychange', this.handleVisibility);
      window.addEventListener('resize', this.handleResize, { passive: true });
    }
  }

  setEffectEnabled(effectKey, isEnabled) {
    if (this.enabledEffects[effectKey] !== undefined) {
      this.enabledEffects[effectKey] = isEnabled;
      if (!isEnabled) {
        this.pool.reset(effectKey === 'clouds' ? 'cloud' : effectKey === 'leaves' ? 'leaf' : effectKey === 'lightMotes' ? 'lightMote' : effectKey === 'fireflies' ? 'firefly' : effectKey === 'stars' ? 'star' : 'smoke');
      }
    }
  }

  /**
   * Reconcile active particles to match target profile and particle budget
   */
  reconcileParticles(profile, budget, cameraPos, virtualWidth, virtualHeight) {
    const effectMapping = [
      { key: 'clouds', type: 'cloud', field: this.fields.clouds },
      { key: 'leaves', type: 'leaf', field: this.fields.leaves },
      { key: 'lightMotes', type: 'lightMote', field: this.fields.lightMotes },
      { key: 'fireflies', type: 'firefly', field: this.fields.fireflies },
      { key: 'stars', type: 'star', field: this.fields.stars },
      { key: 'smoke', type: 'smoke', field: this.fields.smoke },
    ];

    // Compute raw sum of target counts
    let rawSum = 0;
    for (let i = 0; i < effectMapping.length; i++) {
      const { key } = effectMapping[i];
      if (this.enabledEffects[key]) {
        rawSum += (profile[key] || 0);
      }
    }

    // Scale counts down if they exceed device budget
    const budgetScale = rawSum > budget ? (budget / rawSum) : 1.0;

    for (let i = 0; i < effectMapping.length; i++) {
      const { key, type, field } = effectMapping[i];

      if (!this.enabledEffects[key]) {
        this.pool.reset(type);
        continue;
      }

      const target = Math.round((profile[key] || 0) * budgetScale);
      const currentActive = this.pool.getActiveCount(type);

      if (currentActive > target) {
        this.pool.pruneToCount(type, target);
      } else if (currentActive < target) {
        const needed = target - currentActive;
        for (let n = 0; n < needed; n++) {
          const p = this.pool.acquire(type);
          if (!p) break; // Pool capacity reached
          this.seedCounter++;
          field.spawn(p, cameraPos, virtualWidth, virtualHeight, this.seedCounter * 0.317);
        }
      }
    }
  }

  update(dt, engineState, virtualWidth, virtualHeight) {
    if (this.isHidden) return;

    const safeDt = Math.min(dt, 0.05);
    const { cameraPos, scrollProgress, reducedMotion, time } = engineState;

    // Record frame time for adaptive quality evaluation
    this.quality.recordFrame(dt * 1000, time * 1000);

    // Get blended target profile
    const profile = getBlendedProfile(scrollProgress);
    const budget = this.quality.getDeviceBudget(PARTICLE_BUDGET, this.isMobile, this.isTablet, reducedMotion);

    // Synchronize pool counts to profile
    this.reconcileParticles(profile, budget, cameraPos, virtualWidth, virtualHeight);

    // Update active particles
    this.pool.forEachActive((p) => {
      if (p.type === 'cloud') {
        this.fields.clouds.update(p, safeDt, cameraPos, virtualWidth, virtualHeight, reducedMotion);
      } else if (p.type === 'leaf') {
        this.fields.leaves.update(p, safeDt, cameraPos, virtualWidth, virtualHeight, reducedMotion);
      } else if (p.type === 'lightMote') {
        this.fields.lightMotes.update(p, safeDt, cameraPos, virtualWidth, virtualHeight, reducedMotion);
      } else if (p.type === 'firefly') {
        this.fields.fireflies.update(p, safeDt, cameraPos, virtualWidth, virtualHeight, reducedMotion);
      } else if (p.type === 'star') {
        this.fields.stars.update(p, safeDt, cameraPos, virtualWidth, virtualHeight, reducedMotion);
      } else if (p.type === 'smoke') {
        this.fields.smoke.update(p, safeDt, cameraPos, virtualWidth, virtualHeight, reducedMotion);
      }
    });

    this.lastProfile = profile;
  }

  render(ctx, cameraPos, virtualWidth, virtualHeight, scrollProgress) {
    if (this.isHidden) return;

    this.pool.forEachActive((p) => {
      if (p.type === 'cloud' && this.enabledEffects.clouds) {
        this.fields.clouds.render(ctx, p, cameraPos, virtualWidth, virtualHeight, scrollProgress);
      } else if (p.type === 'leaf' && this.enabledEffects.leaves) {
        this.fields.leaves.render(ctx, p, cameraPos, virtualWidth, virtualHeight);
      } else if (p.type === 'lightMote' && this.enabledEffects.lightMotes) {
        this.fields.lightMotes.render(ctx, p, cameraPos, virtualWidth, virtualHeight);
      } else if (p.type === 'firefly' && this.enabledEffects.fireflies) {
        this.fields.fireflies.render(ctx, p, cameraPos, virtualWidth, virtualHeight);
      } else if (p.type === 'star' && this.enabledEffects.stars) {
        this.fields.stars.render(ctx, p, cameraPos, virtualWidth, virtualHeight);
      } else if (p.type === 'smoke' && this.enabledEffects.smoke) {
        this.fields.smoke.render(ctx, p, cameraPos, virtualWidth, virtualHeight);
      }
    });
  }

  getTelemetry() {
    return {
      qualityLevel: this.quality.getQualityLevel(),
      averageFrameTime: this.quality.getAverageFrameTime(),
      activeParticles: this.pool.getActiveCount(),
      freeParticles: this.pool.getFreeCount(),
      counts: {
        clouds: this.pool.getActiveCount('cloud'),
        leaves: this.pool.getActiveCount('leaf'),
        lightMotes: this.pool.getActiveCount('lightMote'),
        fireflies: this.pool.getActiveCount('firefly'),
        stars: this.pool.getActiveCount('star'),
        smoke: this.pool.getActiveCount('smoke'),
      },
      enabled: { ...this.enabledEffects },
      lastProfile: this.lastProfile,
      isHidden: this.isHidden,
    };
  }

  reset() {
    this.pool.reset();
  }

  dispose() {
    this.reset();
    document.removeEventListener('visibilitychange', this.handleVisibility);
    window.removeEventListener('resize', this.handleResize);
  }
}
