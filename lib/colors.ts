/**
 * Centralized color configuration for Sonalysis
 * This is the SINGLE SOURCE OF TRUTH for brand colors
 */

export const colors = {
  // Primary brand color — Spotify green
  primary: '#1DB954',
  primaryLight: '#1ED760',
  primaryLighter: '#57D983',
  primaryDark: '#169C46',

  // Archetype colors
  archetypes: {
    'the-inferno': { from: '#FF6B35', to: '#F7931E' },
    'the-nocturne': { from: '#6B5CE7', to: '#A78BFA' },
    'the-voltage': { from: '#FFE66D', to: '#F0C419' },
    'the-shapeshifter': { from: '#00D4AA', to: '#00B894' },
    'the-classicist': { from: '#E8D5B7', to: '#D4A574' },
    'the-drifter': { from: '#4ECDC4', to: '#44B3A8' },
    'the-shadowweaver': { from: '#6C5B7B', to: '#4A3F5C' },
    'the-daydreamer': { from: '#FF69B4', to: '#FF85C8' },
    'the-ringleader': { from: '#FF4757', to: '#FF6B81' },
    'the-oracle': { from: '#9B59B6', to: '#8E44AD' },
  },
} as const
