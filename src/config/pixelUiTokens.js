/**
 * pixelUiTokens.js
 * Unified Design Tokens for 16-bit Southern Vietnam Pixel UI.
 * Consistent warm dark palette, earthy terracotta accents, and crisp pixel borders.
 */

export const pixelUiTokens = {
  colors: {
    // Surface Backgrounds
    bgBase: '#0c131d',
    bgPanel: '#0f172a',
    bgPanelWarm: '#131b26',
    bgElevated: '#1e293b',

    // Borders & Outlines
    borderPrimary: '#f59e0b', // Amber Gold
    borderSecondary: '#b45309', // Warm Ochre
    borderWood: '#78350f', // Deep Teak Wood
    borderMuted: '#334155', // Slate

    // Text & Accents
    textHeading: '#ffffff',
    textBody: '#e2e8f0',
    textMuted: '#94a3b8',
    textAccent: '#fbbf24', // Warm Glow Yellow
    textEmerald: '#34d399', // Mekong Green

    // Status Colors
    statusOnline: '#10b981',
    statusOnlineBg: 'rgba(16, 185, 129, 0.2)',
  },

  borders: {
    pixelBox: '2px solid #b45309',
    pixelBoxHighlight: '2px solid #f59e0b',
    pixelInner: '1px solid #334155',
  },

  shadows: {
    pixelHard: '4px 4px 0px 0px rgba(0, 0, 0, 0.75)',
    pixelElevated: '6px 6px 0px 0px rgba(11, 15, 25, 0.9)',
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
};
