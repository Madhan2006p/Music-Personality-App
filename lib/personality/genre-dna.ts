/** Genre DNA processor — aggregates artist genres into macro-genre distribution */

import type { SpotifyArtist } from "@/lib/spotify/types"
import type { GenreDNAEntry } from "./types"

/** Macro-genre mapping: maps Spotify micro-genres to broader categories */
const GENRE_MAPPING: Record<string, string[]> = {
  "Pop": ["pop", "indie pop", "art pop", "synth-pop", "electropop", "k-pop", "j-pop", "dream pop", "chamber pop", "baroque pop", "power pop", "teen pop", "dance pop", "europop", "latin pop"],
  "Rock": ["rock", "alternative rock", "indie rock", "classic rock", "punk rock", "post-rock", "progressive rock", "psychedelic rock", "garage rock", "folk rock", "blues rock", "soft rock", "hard rock", "shoegaze", "grunge", "punk", "post-punk", "new wave", "britpop"],
  "Hip-Hop": ["hip hop", "rap", "trap", "conscious hip hop", "underground hip hop", "east coast hip hop", "west coast hip hop", "southern hip hop", "gangsta rap", "boom bap", "cloud rap", "mumble rap", "drill"],
  "Electronic": ["electronic", "edm", "house", "techno", "trance", "dubstep", "drum and bass", "ambient", "downtempo", "idm", "electro", "electronica", "future bass", "deep house", "progressive house", "synthwave", "vaporwave", "chillwave"],
  "R&B": ["r&b", "soul", "neo soul", "contemporary r&b", "funk", "motown", "quiet storm", "new jack swing"],
  "Metal": ["metal", "heavy metal", "death metal", "black metal", "thrash metal", "doom metal", "power metal", "progressive metal", "metalcore", "deathcore", "nu metal", "symphonic metal"],
  "Jazz": ["jazz", "smooth jazz", "jazz fusion", "bebop", "cool jazz", "free jazz", "acid jazz", "contemporary jazz", "vocal jazz", "swing"],
  "Classical": ["classical", "opera", "orchestral", "chamber music", "romantic", "baroque", "contemporary classical", "minimalism", "neoclassical"],
  "Folk": ["folk", "indie folk", "folk-pop", "acoustic", "singer-songwriter", "americana", "country folk", "freak folk"],
  "Country": ["country", "alternative country", "country rock", "outlaw country", "country pop", "bluegrass", "honky-tonk"],
  "Latin": ["latin", "reggaeton", "latin pop", "salsa", "bachata", "cumbia", "bossa nova", "samba", "latin rock", "tropical"],
  "World": ["afrobeats", "afropop", "bollywood", "k-indie", "j-rock", "celtic", "flamenco", "fado", "world music", "dancehall", "reggae", "ska", "dub"],
}

/** Colors for each macro-genre */
const GENRE_COLORS: Record<string, string> = {
  "Pop": "#FF69B4",
  "Rock": "#FF4757",
  "Hip-Hop": "#FFA502",
  "Electronic": "#1DB954",
  "R&B": "#9B59B6",
  "Metal": "#2D2D2D",
  "Jazz": "#E8D5B7",
  "Classical": "#DDA0DD",
  "Folk": "#8B6914",
  "Country": "#DAA520",
  "Latin": "#FF6348",
  "World": "#00D4AA",
  "Other": "#636E72",
}

/** Classify a single micro-genre into a macro-genre */
function classifyGenre(genre: string): string {
  const lowerGenre = genre.toLowerCase()
  for (const [macroGenre, patterns] of Object.entries(GENRE_MAPPING)) {
    if (patterns.some((pattern) => lowerGenre.includes(pattern) || pattern.includes(lowerGenre))) {
      return macroGenre
    }
  }
  return "Other"
}

/** Calculate genre DNA distribution from a list of artists */
export function calculateGenreDNA(artists: SpotifyArtist[]): GenreDNAEntry[] {
  const genreCounts: Record<string, number> = {}

  for (const artist of artists) {
    for (const genre of artist.genres) {
      const macroGenre = classifyGenre(genre)
      genreCounts[macroGenre] = (genreCounts[macroGenre] || 0) + 1
    }
  }

  const totalCount = Object.values(genreCounts).reduce((a, b) => a + b, 0)
  if (totalCount === 0) {
    return [{ genre: "Unknown", percentage: 100, color: GENRE_COLORS["Other"] }]
  }

  const entries: GenreDNAEntry[] = Object.entries(genreCounts)
    .map(([genre, count]) => ({
      genre,
      percentage: Math.round((count / totalCount) * 100),
      color: GENRE_COLORS[genre] || GENRE_COLORS["Other"],
    }))
    .sort((a, b) => b.percentage - a.percentage)

  // Only keep genres above 2%, rest go into "Other"
  const significant = entries.filter((e) => e.percentage >= 2)
  const otherPercentage = entries
    .filter((e) => e.percentage < 2)
    .reduce((sum, e) => sum + e.percentage, 0)

  if (otherPercentage > 0) {
    const existingOther = significant.find((e) => e.genre === "Other")
    if (existingOther) {
      existingOther.percentage += otherPercentage
    } else {
      significant.push({
        genre: "Other",
        percentage: otherPercentage,
        color: GENRE_COLORS["Other"],
      })
    }
  }

  // Normalize to exactly 100%
  const total = significant.reduce((sum, e) => sum + e.percentage, 0)
  if (total !== 100 && significant.length > 0) {
    significant[0].percentage += 100 - total
  }

  return significant
}

/** Calculate genre diversity score (0-1, higher = more diverse) */
export function calculateGenreDiversity(artists: SpotifyArtist[]): number {
  const allGenres = new Set<string>()
  const macroGenres = new Set<string>()

  for (const artist of artists) {
    for (const genre of artist.genres) {
      allGenres.add(genre.toLowerCase())
      macroGenres.add(classifyGenre(genre))
    }
  }

  // Shannon diversity index simplified
  const genreDna = calculateGenreDNA(artists)
  let entropy = 0
  for (const entry of genreDna) {
    const p = entry.percentage / 100
    if (p > 0) {
      entropy -= p * Math.log2(p)
    }
  }

  // Normalize: max entropy = log2(n) where n = number of genres
  const maxEntropy = Math.log2(Math.max(genreDna.length, 1))
  return maxEntropy > 0 ? Math.min(entropy / maxEntropy, 1) : 0
}
