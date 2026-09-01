/**
 * WorldPaletteTrack.js
 * Continuous color sampling track across the entire 6-scene Mekong portfolio world.
 * Guarantees smooth progress-interpolated atmosphere, water, and earth transitions.
 */

function parseColor(hex) {
  if (hex.startsWith('#')) {
    const num = parseInt(hex.slice(1), 16);
    if (hex.length === 4) {
      const r = ((num >> 8) & 0xf) * 17;
      const g = ((num >> 4) & 0xf) * 17;
      const b = (num & 0xf) * 17;
      return { r, g, b };
    }
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  }
  return { r: 125, g: 211, b: 252 };
}

function interpolateColor(color1, color2, factor) {
  const c1 = parseColor(color1);
  const c2 = parseColor(color2);
  const r = Math.round(c1.r + factor * (c2.r - c1.r));
  const g = Math.round(c1.g + factor * (c2.g - c1.g));
  const b = Math.round(c1.b + factor * (c2.b - c1.b));
  return `rgb(${r}, ${g}, ${b})`;
}

// World Keyframe Palette Track across scroll progress (0.0 -> 1.0)
const WORLD_KEYFRAMES = [
  {
    progress: 0.00, // Dawn (Hero)
    skyTop: '#38bdf8',
    skyMid: '#bae6fd',
    skyBottom: '#fed7aa',
    earthBase: '#78350f',
    earthTop: '#15803d',
    riverBase: '#0284c7',
    riverShimmer: '#7dd3fc',
  },
  {
    progress: 0.22, // Morning (About)
    skyTop: '#0284c7',
    skyMid: '#7dd3fc',
    skyBottom: '#bae6fd',
    earthBase: '#854d0e',
    earthTop: '#16a34a',
    riverBase: '#0369a1',
    riverShimmer: '#bae6fd',
  },
  {
    progress: 0.40, // Midday (Projects)
    skyTop: '#0369a1',
    skyMid: '#38bdf8',
    skyBottom: '#e0f2fe',
    earthBase: '#713f12',
    earthTop: '#15803d',
    riverBase: '#0284c7',
    riverShimmer: '#bae6fd',
  },
  {
    progress: 0.58, // Warm afternoon (Technology)
    skyTop: '#2563a8',
    skyMid: '#55a5c9',
    skyBottom: '#f2bd67',
    earthBase: '#5f3418',
    earthTop: '#21703b',
    riverBase: '#236a87',
    riverShimmer: '#f1c678',
  },
  {
    progress: 0.76, // Golden sunset (Playground)
    skyTop: '#7c2d12',
    skyMid: '#c2410c',
    skyBottom: '#f97316',
    earthBase: '#451a03',
    earthTop: '#166534',
    riverBase: '#9a3412',
    riverShimmer: '#fdba74',
  },
  {
    progress: 0.90, // Twilight (Playground -> Contact)
    skyTop: '#0f172a',
    skyMid: '#1e1b4b',
    skyBottom: '#4c1d95',
    earthBase: '#1a1006',
    earthTop: '#14532d',
    riverBase: '#1e1b4b',
    riverShimmer: '#a78bfa',
  },
  {
    progress: 1.00, // Midnight (Contact)
    skyTop: '#030206',
    skyMid: '#0b091a',
    skyBottom: '#1e1b4b',
    earthBase: '#0f0a04',
    earthTop: '#064e3b',
    riverBase: '#0b091a',
    riverShimmer: '#818cf8',
  },
];

export class WorldPaletteTrack {
  static sample(progress) {
    const p = Math.min(Math.max(progress, 0), 1);
    let idx = 0;
    for (let i = 0; i < WORLD_KEYFRAMES.length - 1; i++) {
      if (p >= WORLD_KEYFRAMES[i].progress && p <= WORLD_KEYFRAMES[i + 1].progress) {
        idx = i;
        break;
      }
    }

    const k1 = WORLD_KEYFRAMES[idx];
    const k2 = WORLD_KEYFRAMES[idx + 1] || k1;
    const span = k2.progress - k1.progress || 1;
    const factor = (p - k1.progress) / span;

    return {
      skyTop: interpolateColor(k1.skyTop, k2.skyTop, factor),
      skyMid: interpolateColor(k1.skyMid, k2.skyMid, factor),
      skyBottom: interpolateColor(k1.skyBottom, k2.skyBottom, factor),
      earthBase: interpolateColor(k1.earthBase, k2.earthBase, factor),
      earthTop: interpolateColor(k1.earthTop, k2.earthTop, factor),
      riverBase: interpolateColor(k1.riverBase, k2.riverBase, factor),
      riverShimmer: interpolateColor(k1.riverShimmer, k2.riverShimmer, factor),
    };
  }
}
