/**
 * atmosphereProfiles.js
 * Master configuration for atmospheric particles across 6 portfolio scenes.
 * Includes particle budgets, scene profiles, and transition interpolation ranges.
 */

export const PARTICLE_BUDGET = {
  desktop: 120,
  tablet: 80,
  mobile: 48,
  reducedMotion: 8,
};

export const atmosphereProfiles = {
  hero: {
    clouds: 0,
    leaves: 6,
    lightMotes: 18,
    fireflies: 0,
    stars: 0,
    smoke: 0,
  },

  about: {
    clouds: 0,
    leaves: 14,
    lightMotes: 10,
    fireflies: 0,
    stars: 0,
    smoke: 0,
  },

  projects: {
    clouds: 0,
    leaves: 8,
    lightMotes: 8,
    fireflies: 0,
    stars: 2,
    smoke: 0,
  },

  technology: {
    clouds: 0,
    leaves: 6,
    lightMotes: 10,
    fireflies: 0,
    stars: 0,
    smoke: 0,
  },

  playground: {
    clouds: 0,
    leaves: 3,
    lightMotes: 2,
    fireflies: 18,
    stars: 14,
    smoke: 0,
  },

  contact: {
    clouds: 0,
    leaves: 0,
    lightMotes: 0,
    fireflies: 5,
    stars: 28,
    smoke: 0,
  },
};

// Keyframe markers for transition blending
export const SCENE_RANGES = [
  { id: 'hero', start: 0, focus: 0.05, end: 0.14, profile: atmosphereProfiles.hero },
  { id: 'about', start: 0.14, focus: 0.23, end: 0.32, profile: atmosphereProfiles.about },
  { id: 'projects', start: 0.32, focus: 0.41, end: 0.5, profile: atmosphereProfiles.projects },
  { id: 'technology', start: 0.5, focus: 0.59, end: 0.68, profile: atmosphereProfiles.technology },
  { id: 'playground', start: 0.68, focus: 0.77, end: 0.86, profile: atmosphereProfiles.playground },
  { id: 'contact', start: 0.86, focus: 0.95, end: 1, profile: atmosphereProfiles.contact },
];

function smoothstep(min, max, value) {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

/**
 * Calculates smoothly blended particle target counts based on scrollProgress
 */
export function getBlendedProfile(progress) {
  const p = Math.min(Math.max(progress, 0), 1);
  for (let index = 0; index < SCENE_RANGES.length - 1; index += 1) {
    const current = SCENE_RANGES[index];
    const next = SCENE_RANGES[index + 1];
    if (p <= current.focus) return { ...current.profile };
    if (p < next.focus) {
      return interpolateProfile(current.profile, next.profile, smoothstep(current.focus, next.focus, p));
    }
  }
  return { ...SCENE_RANGES[SCENE_RANGES.length - 1].profile };
}

function interpolateProfile(p1, p2, factor) {
  const result = {};
  const keys = ['clouds', 'leaves', 'lightMotes', 'fireflies', 'stars', 'smoke'];
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    result[k] = Math.round(p1[k] + factor * (p2[k] - p1[k]));
  }
  return result;
}
