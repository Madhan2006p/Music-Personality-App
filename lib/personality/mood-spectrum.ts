/** Mood spectrum calculator from audio features */

import type { AudioFeatures } from "@/lib/spotify/types"
import type { MoodSpectrum, AudioFeaturesAverage } from "./types"

/** Calculate average audio features from a list */
export function calculateAudioFeaturesAverage(features: AudioFeatures[]): AudioFeaturesAverage {
  if (features.length === 0) {
    return {
      danceability: 0.5,
      energy: 0.5,
      valence: 0.5,
      acousticness: 0.3,
      instrumentalness: 0.1,
      speechiness: 0.1,
      liveness: 0.2,
      tempo: 120,
      loudness: -10,
    }
  }

  const sum = features.reduce(
    (acc, f) => ({
      danceability: acc.danceability + f.danceability,
      energy: acc.energy + f.energy,
      valence: acc.valence + f.valence,
      acousticness: acc.acousticness + f.acousticness,
      instrumentalness: acc.instrumentalness + f.instrumentalness,
      speechiness: acc.speechiness + f.speechiness,
      liveness: acc.liveness + f.liveness,
      tempo: acc.tempo + f.tempo,
      loudness: acc.loudness + f.loudness,
    }),
    {
      danceability: 0,
      energy: 0,
      valence: 0,
      acousticness: 0,
      instrumentalness: 0,
      speechiness: 0,
      liveness: 0,
      tempo: 0,
      loudness: 0,
    },
  )

  const n = features.length
  return {
    danceability: Math.round((sum.danceability / n) * 1000) / 1000,
    energy: Math.round((sum.energy / n) * 1000) / 1000,
    valence: Math.round((sum.valence / n) * 1000) / 1000,
    acousticness: Math.round((sum.acousticness / n) * 1000) / 1000,
    instrumentalness: Math.round((sum.instrumentalness / n) * 1000) / 1000,
    speechiness: Math.round((sum.speechiness / n) * 1000) / 1000,
    liveness: Math.round((sum.liveness / n) * 1000) / 1000,
    tempo: Math.round(sum.tempo / n),
    loudness: Math.round((sum.loudness / n) * 10) / 10,
  }
}

/** Calculate mood spectrum from audio features average */
export function calculateMoodSpectrum(avg: AudioFeaturesAverage): MoodSpectrum {
  return {
    // Energy: direct mapping (0-1 → 0-100)
    energy: Math.round(avg.energy * 100),

    // Happiness: primarily valence, slightly boosted by danceability
    happiness: Math.round((avg.valence * 0.8 + avg.danceability * 0.2) * 100),

    // Intensity: combination of energy, loudness (normalized), and tempo
    intensity: Math.round(
      (avg.energy * 0.4 +
        Math.min(Math.max((avg.loudness + 20) / 20, 0), 1) * 0.3 +
        Math.min(avg.tempo / 200, 1) * 0.3) *
        100,
    ),

    // Exploration: inverse of mainstream appeal (acousticness + instrumentalness + speechiness variety)
    exploration: Math.round(
      (avg.instrumentalness * 0.3 +
        avg.speechiness * 0.2 +
        avg.acousticness * 0.2 +
        avg.liveness * 0.3) *
        100,
    ),

    // Danceability: direct mapping
    danceability: Math.round(avg.danceability * 100),

    // Acousticness: direct mapping
    acousticness: Math.round(avg.acousticness * 100),
  }
}
