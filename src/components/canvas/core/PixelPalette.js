/**
 * Western Vietnam Pixel Art Bible - Curated 29-Color Palette (Max 32)
 * Designed strictly with 3-tier lighting: Shadow, Base, Highlight.
 * Outlines use deep organic navy and warm dark umber, never pure harsh black.
 */
export const palette = {
  // 1. Organic Outlines (2 colors)
  outline: {
    dark: '#141824', // Deep indigo navy for cool tones and general silhouettes
    warm: '#261612', // Deep warm umber for wood, roof, and soil
  },

  // 2. Skin & Characters (3 colors)
  skin: {
    highlight: '#ffdcb3',
    base: '#e8a87c',
    shadow: '#a36545',
  },

  // 3. Wood & Bamboo (3 colors)
  wood: {
    highlight: '#dfb878', // Bamboo & light wood highlight
    base: '#9a6337',      // Aged timber & wooden planks
    shadow: '#543118',    // Deep timber grain & shadows
  },

  // 4. Traditional Roof & Brick (3 colors)
  roof: {
    highlight: '#e65c40', // Terracotta tile highlight
    base: '#b83824',      // Vietnamese clay roof red
    shadow: '#691d14',    // Tile groove & mossy edge shadow
  },

  // 5. Earth & Clay Urn (3 colors)
  earth: {
    highlight: '#b8743a', // Clay urn glaze highlight
    base: '#7d431f',      // Mekong brown alluvial clay
    shadow: '#4a230e',    // Muddy riverbank shadow
  },

  // 6. Tropical Foliage & Plants (3 colors)
  foliage: {
    highlight: '#7ed957', // Young coconut leaf & sunlit grass
    base: '#389e24',      // Deep palm green
    shadow: '#1b5e14',    // Dense forest canopy shadow
  },

  // 7. Mekong River & Water (3 colors)
  river: {
    highlight: '#7dd3fc', // Wave crest & ripple shimmer
    base: '#0284c7',      // River water midtone
    shadow: '#0c4a6e',    // Deep canal water shadow
  },

  // 8. Lotus & Tropical Flowers (3 colors)
  lotus: {
    highlight: '#ff94c8', // Pink lotus petal tip
    base: '#d94686',      // Lotus bloom magenta
    stamen: '#fbbf24',    // Yellow pollen stamen / Hyacinth accent
  },

  // 9. Sky & Atmosphere (2 colors)
  sky: {
    morning: '#bae6fd',   // Clear dawn blue
    sunset: '#f97316',    // Mekong dusk golden orange
  },

  // 10. Night Atmosphere (2 colors)
  night: {
    base: '#1e1b4b',      // Night sky indigo
    shadow: '#0b091a',    // Deep midnight shadow
  },

  // 11. Fire & Light FX (2 colors)
  fire: {
    yellow: '#fef08a',    // Core flame & lantern light
    red: '#ef4444',       // Flame edge & dragon fruit red
  },
};
