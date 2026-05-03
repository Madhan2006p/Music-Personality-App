/** Core personality engine — classifies listening archetype from Spotify data */

import type { SpotifyArtist, SpotifyTrack, AudioFeatures } from "@/lib/spotify/types"
import type { PersonalityResult, Archetype, ArtistSummary, TrackSummary } from "./types"
import { calculateGenreDNA, calculateGenreDiversity } from "./genre-dna"
import { calculateAudioFeaturesAverage, calculateMoodSpectrum } from "./mood-spectrum"
import { generateAlterEgo } from "./alter-ego"

/** All 10 listening archetypes with their visual identity */
export const ARCHETYPES: Archetype[] = [
  {
    id: "the-inferno",
    name: "The Inferno",
    emoji: "🔥",
    color: "#FF6B35",
    gradientFrom: "#FF6B35",
    gradientTo: "#F7931E",
    description: "You burn bright with infectious energy. Your playlists are a celebration — high-octane, feel-good anthems that could light up any room.",
    tagline: "Born to ignite",
  },
  {
    id: "the-nocturne",
    name: "The Nocturne",
    emoji: "🌙",
    color: "#6B5CE7",
    gradientFrom: "#6B5CE7",
    gradientTo: "#A78BFA",
    description: "The night is your canvas. You're drawn to intimate, atmospheric soundscapes — acoustic whispers and ambient textures that feel like moonlight.",
    tagline: "Sound after dark",
  },
  {
    id: "the-voltage",
    name: "The Voltage",
    emoji: "⚡",
    color: "#FFE66D",
    gradientFrom: "#FFE66D",
    gradientTo: "#F0C419",
    description: "Pure electric current. You crave maximum intensity — fast tempos, crushing riffs, and beats that hit like lightning.",
    tagline: "Maximum overdrive",
  },
  {
    id: "the-shapeshifter",
    name: "The Shapeshifter",
    emoji: "🎭",
    color: "#00D4AA",
    gradientFrom: "#00D4AA",
    gradientTo: "#00B894",
    description: "Genre boundaries don't exist for you. Your library is a mosaic of sounds — jazz to hip-hop, classical to electronic, all in one playlist.",
    tagline: "Every genre, one soul",
  },
  {
    id: "the-classicist",
    name: "The Classicist",
    emoji: "💎",
    color: "#E8D5B7",
    gradientFrom: "#E8D5B7",
    gradientTo: "#D4A574",
    description: "You appreciate the craft. Instrumental mastery, complex arrangements, and timeless compositions speak to your refined ear.",
    tagline: "Timeless taste",
  },
  {
    id: "the-drifter",
    name: "The Drifter",
    emoji: "🌊",
    color: "#4ECDC4",
    gradientFrom: "#4ECDC4",
    gradientTo: "#44B3A8",
    description: "You float through sound with ease. Chill vibes, lo-fi beats, and indie melodies create your perfect sonic backdrop for life.",
    tagline: "Going with the flow",
  },
  {
    id: "the-shadowweaver",
    name: "The Shadowweaver",
    emoji: "🖤",
    color: "#6C5B7B",
    gradientFrom: "#6C5B7B",
    gradientTo: "#4A3F5C",
    description: "You find beauty in darkness. Heavy, moody, intense — your music is a cathartic journey through shadow and depth.",
    tagline: "Embrace the dark",
  },
  {
    id: "the-daydreamer",
    name: "The Daydreamer",
    emoji: "🌸",
    color: "#FF69B4",
    gradientFrom: "#FF69B4",
    gradientTo: "#FF85C8",
    description: "Sunshine in sonic form. Your taste is bright, breezy, and unapologetically joyful — pop melodies that paint the world in pastels.",
    tagline: "Bliss on repeat",
  },
  {
    id: "the-ringleader",
    name: "The Ringleader",
    emoji: "🎪",
    color: "#FF4757",
    gradientFrom: "#FF4757",
    gradientTo: "#FF6B81",
    description: "You've got your finger on the pulse. Chart-toppers, viral hits, high-energy dance tracks — if it's popular, you're already there.",
    tagline: "Center of attention",
  },
  {
    id: "the-oracle",
    name: "The Oracle",
    emoji: "🔮",
    color: "#9B59B6",
    gradientFrom: "#9B59B6",
    gradientTo: "#8E44AD",
    description: "You discover what others haven't found yet. Deep cuts, niche artists, underground gems — your taste is ahead of the curve.",
    tagline: "Ahead of the wave",
  },
]

/** Weight vectors for each archetype — [energy, valence, dance, acoustic, instrumental, genreDiversity, popularity, tempo] */
const ARCHETYPE_WEIGHTS: Record<string, number[]> = {
  "the-inferno":       [ 0.25, 0.30, 0.20, -0.10, -0.10,  0.00,  0.15,  0.10],
  "the-nocturne":      [-0.20, -0.10, -0.15,  0.35,  0.20,  0.10, -0.10, -0.10],
  "the-voltage":       [ 0.35, 0.00,  0.05, -0.15, -0.05, -0.05,  0.05,  0.30],
  "the-shapeshifter":  [ 0.00, 0.00,  0.00,  0.00,  0.00,  0.60,  0.00,  0.00],
  "the-classicist":    [-0.10, 0.00, -0.15,  0.20,  0.45,  0.00, -0.15,  0.05],
  "the-drifter":       [-0.05, 0.10,  0.05,  0.15,  0.05,  0.10, -0.05, -0.15],
  "the-shadowweaver":  [ 0.25, -0.35,  0.00, -0.10,  0.05,  0.00,  0.00,  0.15],
  "the-daydreamer":    [ 0.05, 0.35,  0.15, -0.05, -0.15,  0.00,  0.20, -0.05],
  "the-ringleader":    [ 0.10, 0.10,  0.30, -0.10, -0.10, -0.10,  0.35,  0.05],
  "the-oracle":        [ 0.00, 0.00,  0.00,  0.10,  0.10,  0.20, -0.50,  0.00],
}

/** Normalize a value to 0-1 range */
function normalize(value: number, min: number, max: number): number {
  return Math.max(0, Math.min(1, (value - min) / (max - min)))
}

/** Calculate archetype scores */
function scoreArchetypes(
  avgFeatures: { danceability: number; energy: number; valence: number; acousticness: number; instrumentalness: number; tempo: number },
  genreDiversity: number,
  avgPopularity: number,
): Record<string, number> {
  const features = [
    avgFeatures.energy,
    avgFeatures.valence,
    avgFeatures.danceability,
    avgFeatures.acousticness,
    avgFeatures.instrumentalness,
    genreDiversity,
    normalize(avgPopularity, 0, 100),
    normalize(avgFeatures.tempo, 60, 200),
  ]

  const scores: Record<string, number> = {}
  for (const [archetypeId, weights] of Object.entries(ARCHETYPE_WEIGHTS)) {
    let score = 0.5 // base score
    for (let i = 0; i < weights.length; i++) {
      score += weights[i] * features[i]
    }
    scores[archetypeId] = Math.max(0, Math.min(1, score))
  }

  return scores
}

/** Summarize artists for storage */
function summarizeArtists(artists: SpotifyArtist[], limit = 10): ArtistSummary[] {
  return artists.slice(0, limit).map((a) => ({
    id: a.id,
    name: a.name,
    imageUrl: a.images[0]?.url || null,
    genres: a.genres.slice(0, 3),
    popularity: a.popularity,
  }))
}

/** Summarize tracks for storage */
function summarizeTracks(tracks: SpotifyTrack[], limit = 10): TrackSummary[] {
  return tracks.slice(0, limit).map((t) => ({
    id: t.id,
    name: t.name,
    artist: t.artists.map((a) => a.name).join(", "),
    albumArt: t.album.images[0]?.url || null,
    popularity: t.popularity,
  }))
}

/** Main analysis function — takes raw Spotify data and returns a PersonalityResult */
export function analyzePersonality(
  allArtists: SpotifyArtist[],
  topTracks: SpotifyTrack[],
  audioFeatures: AudioFeatures[],
  spotifyUserId?: string,
  spotifyDisplayName?: string,
  spotifyAvatarUrl?: string,
): PersonalityResult {
  // 1. Calculate audio features average
  const avgFeatures = calculateAudioFeaturesAverage(audioFeatures)

  // 2. Calculate genre DNA
  const genreDNA = calculateGenreDNA(allArtists)
  const genreDiversity = calculateGenreDiversity(allArtists)

  // 3. Calculate average popularity
  const avgPopularity = topTracks.length > 0
    ? topTracks.reduce((sum, t) => sum + t.popularity, 0) / topTracks.length
    : 50

  // 4. Score all archetypes
  const allScores = scoreArchetypes(avgFeatures, genreDiversity, avgPopularity)

  // 5. Find winning archetype
  const winningId = Object.entries(allScores).sort((a, b) => b[1] - a[1])[0][0]
  const archetype = ARCHETYPES.find((a) => a.id === winningId)!
  const archetypeScore = allScores[winningId]

  // 6. Calculate mood spectrum
  const moodSpectrum = calculateMoodSpectrum(avgFeatures)

  // 7. Generate alter ego
  const alterEgo = generateAlterEgo(archetype, moodSpectrum, genreDNA, spotifyUserId)

  return {
    archetype,
    archetypeScore,
    allScores,
    alterEgo,
    genreDNA,
    moodSpectrum,
    topArtists: summarizeArtists(allArtists),
    topTracks: summarizeTracks(topTracks),
    audioFeaturesAvg: avgFeatures,
    spotifyUserId,
    spotifyDisplayName,
    spotifyAvatarUrl,
  }
}

/** Generate demo/mock personality result for users without Spotify */
export function generateDemoResult(): PersonalityResult {
  const archetype = ARCHETYPES[3] // The Shapeshifter
  const moodSpectrum = { energy: 68, happiness: 72, intensity: 55, exploration: 78, danceability: 65, acousticness: 32 }
  const genreDNA = [
    { genre: "Pop", percentage: 28, color: "#FF69B4" },
    { genre: "Rock", percentage: 22, color: "#FF4757" },
    { genre: "Electronic", percentage: 18, color: "#1DB954" },
    { genre: "Hip-Hop", percentage: 15, color: "#FFA502" },
    { genre: "R&B", percentage: 10, color: "#9B59B6" },
    { genre: "Folk", percentage: 7, color: "#8B6914" },
  ]
  const alterEgo = generateAlterEgo(archetype, moodSpectrum, genreDNA, "demo-user")

  return {
    archetype,
    archetypeScore: 0.82,
    allScores: Object.fromEntries(ARCHETYPES.map((a, i) => [a.id, 0.82 - i * 0.05])),
    alterEgo,
    genreDNA,
    moodSpectrum,
    topArtists: [
      { id: "1", name: "Radiohead", imageUrl: null, genres: ["alternative rock"], popularity: 82 },
      { id: "2", name: "Daft Punk", imageUrl: null, genres: ["electronic"], popularity: 79 },
      { id: "3", name: "Kendrick Lamar", imageUrl: null, genres: ["hip hop"], popularity: 90 },
      { id: "4", name: "Bon Iver", imageUrl: null, genres: ["indie folk"], popularity: 74 },
      { id: "5", name: "Tyler, The Creator", imageUrl: null, genres: ["hip hop", "rap"], popularity: 88 },
    ],
    topTracks: [
      { id: "1", name: "Everything In Its Right Place", artist: "Radiohead", albumArt: null, popularity: 72 },
      { id: "2", name: "Get Lucky", artist: "Daft Punk", albumArt: null, popularity: 85 },
      { id: "3", name: "HUMBLE.", artist: "Kendrick Lamar", albumArt: null, popularity: 88 },
      { id: "4", name: "Skinny Love", artist: "Bon Iver", albumArt: null, popularity: 78 },
      { id: "5", name: "EARFQUAKE", artist: "Tyler, The Creator", albumArt: null, popularity: 84 },
    ],
    audioFeaturesAvg: {
      danceability: 0.62, energy: 0.68, valence: 0.55, acousticness: 0.25,
      instrumentalness: 0.12, speechiness: 0.08, liveness: 0.15, tempo: 122, loudness: -7.2,
    },
  }
}
