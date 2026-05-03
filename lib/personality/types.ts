/** Personality engine TypeScript types */

export interface PersonalityResult {
  archetype: Archetype
  archetypeScore: number
  allScores: Record<string, number>
  alterEgo: AlterEgo
  genreDNA: GenreDNAEntry[]
  moodSpectrum: MoodSpectrum
  topArtists: ArtistSummary[]
  topTracks: TrackSummary[]
  audioFeaturesAvg: AudioFeaturesAverage
  spotifyUserId?: string
  spotifyDisplayName?: string
  spotifyAvatarUrl?: string
}

export interface Archetype {
  id: string
  name: string
  emoji: string
  color: string
  gradientFrom: string
  gradientTo: string
  description: string
  tagline: string
}

export interface AlterEgo {
  name: string
  title: string
  description: string
  traits: string[]
}

export interface GenreDNAEntry {
  genre: string
  percentage: number
  color: string
}

export interface MoodSpectrum {
  energy: number       // 0-100: Calm ↔ Energetic
  happiness: number    // 0-100: Melancholy ↔ Joyful
  intensity: number    // 0-100: Gentle ↔ Intense
  exploration: number  // 0-100: Familiar ↔ Experimental
  danceability: number // 0-100: Still ↔ Groovy
  acousticness: number // 0-100: Electronic ↔ Acoustic
}

export interface AudioFeaturesAverage {
  danceability: number
  energy: number
  valence: number
  acousticness: number
  instrumentalness: number
  speechiness: number
  liveness: number
  tempo: number
  loudness: number
}

export interface ArtistSummary {
  id: string
  name: string
  imageUrl: string | null
  genres: string[]
  popularity: number
}

export interface TrackSummary {
  id: string
  name: string
  artist: string
  albumArt: string | null
  popularity: number
}
