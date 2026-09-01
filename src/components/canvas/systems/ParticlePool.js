/**
 * ParticlePool.js
 * High-performance, zero-allocation object pool for atmospheric particles.
 * Pre-allocates particle memory and avoids garbage collection pauses.
 */

const POOL_CAPACITY = 160;

export class ParticlePool {
  constructor(capacity = POOL_CAPACITY) {
    this.capacity = capacity;
    this.particles = new Array(capacity);

    for (let i = 0; i < capacity; i++) {
      this.particles[i] = {
        id: i,
        active: false,
        type: '',
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        life: 0,
        maxLife: 1,
        frame: 0,
        depth: 1.0,
        alpha: 1.0,
        size: 2,
        scale: 1.0,
        color: '#ffffff',
        phase: 0,
        speed: 1,
        seed: i * 0.173 + 0.541,
      };
    }
  }

  /**
   * Acquire a free particle from the pool for a given effect type
   */
  acquire(type) {
    for (let i = 0; i < this.capacity; i++) {
      const p = this.particles[i];
      if (!p.active) {
        p.active = true;
        p.type = type;
        p.life = 0;
        p.maxLife = 1;
        p.alpha = 1.0;
        p.frame = 0;
        return p;
      }
    }
    return null; // Pool full
  }

  /**
   * Return a particle back to the pool
   */
  release(particle) {
    if (particle) {
      particle.active = false;
      particle.type = '';
    }
  }

  /**
   * Release all active particles of a specific type (or all if omitted)
   */
  reset(type = null) {
    for (let i = 0; i < this.capacity; i++) {
      const p = this.particles[i];
      if (!type || p.type === type) {
        p.active = false;
        p.type = '';
      }
    }
  }

  /**
   * Returns the count of active particles (optionally filtered by type)
   */
  getActiveCount(type = null) {
    let count = 0;
    for (let i = 0; i < this.capacity; i++) {
      const p = this.particles[i];
      if (p.active && (!type || p.type === type)) {
        count++;
      }
    }
    return count;
  }

  getFreeCount() {
    return this.capacity - this.getActiveCount();
  }

  /**
   * Release excess particles of a given type down to a target count
   */
  pruneToCount(type, targetCount) {
    let current = 0;
    for (let i = 0; i < this.capacity; i++) {
      const p = this.particles[i];
      if (p.active && p.type === type) {
        current++;
        if (current > targetCount) {
          p.active = false;
        }
      }
    }
  }

  /**
   * Iterate over all active particles without allocating new arrays
   */
  forEachActive(callback) {
    for (let i = 0; i < this.capacity; i++) {
      const p = this.particles[i];
      if (p.active) {
        callback(p);
      }
    }
  }
}
