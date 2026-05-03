/** Music Alter Ego generator — creates a persona from listening data */

import type { Archetype, AlterEgo, MoodSpectrum, GenreDNAEntry } from "./types"

const NAME_PREFIXES: Record<string, string[]> = {
  dark: ["Shadow", "Midnight", "Obsidian", "Phantom", "Eclipse", "Noir"],
  bright: ["Solar", "Neon", "Nova", "Prism", "Aurora", "Radiant"],
  calm: ["Velvet", "Lunar", "Silver", "Whisper", "Silk", "Mist"],
  wild: ["Storm", "Blaze", "Thunder", "Voltage", "Inferno", "Surge"],
  mystical: ["Ethereal", "Astral", "Cosmic", "Arcane", "Mystic", "Oracle"],
  warm: ["Amber", "Honey", "Copper", "Ember", "Coral", "Ruby"],
}

const NAME_SUFFIXES: Record<string, string[]> = {
  electronic: ["Circuit", "Pulse", "Synth", "Frequency", "Signal", "Resonance"],
  organic: ["Willow", "River", "Meadow", "Canyon", "Cedar", "Bloom"],
  urban: ["Alchemist", "Architect", "Maverick", "Pioneer", "Catalyst", "Nomad"],
  ethereal: ["Dreamer", "Wanderer", "Voyager", "Seeker", "Oracle", "Siren"],
  intense: ["Tempest", "Forge", "Titan", "Sentinel", "Vanguard", "Apex"],
  groove: ["Rhythm", "Flow", "Cadence", "Groove", "Tempo", "Vibe"],
}

const TITLE_TEMPLATES: Record<string, string[]> = {
  "the-inferno": ["Keeper of the Flame", "The Eternal Flame"],
  "the-nocturne": ["Night's Own Voice", "The Twilight Curator"],
  "the-voltage": ["The Living Current", "Conductor of Chaos"],
  "the-shapeshifter": ["The Genre Chameleon", "Master of Many Sounds"],
  "the-classicist": ["Guardian of Timeless Sound", "The Sonic Historian"],
  "the-drifter": ["The Ambient Wanderer", "Walker Between Worlds"],
  "the-shadowweaver": ["Architect of Darkness", "Weaver of Shadows"],
  "the-daydreamer": ["The Pastel Virtuoso", "Painter of Sunlit Sound"],
  "the-ringleader": ["Commander of the Crowd", "The Hit Maestro"],
  "the-oracle": ["The Underground Prophet", "The Deep Cut Diviner"],
}

function deterministicPick<T>(items: T[], seed: string): T {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i)
    hash = hash & hash
  }
  return items[Math.abs(hash) % items.length]
}

function selectPools(mood: MoodSpectrum, topGenre: string) {
  let prefixKey = "calm"
  if (mood.energy > 70 && mood.intensity > 60) prefixKey = "wild"
  else if (mood.happiness > 65) prefixKey = "bright"
  else if (mood.happiness < 35) prefixKey = "dark"
  else if (mood.exploration > 60) prefixKey = "mystical"
  else if (mood.acousticness > 55) prefixKey = "warm"

  const g = topGenre.toLowerCase()
  let suffixKey = "groove"
  if (["electronic", "edm", "techno", "house"].some((x) => g.includes(x))) suffixKey = "electronic"
  else if (["folk", "acoustic", "classical", "jazz"].some((x) => g.includes(x))) suffixKey = "organic"
  else if (["hip-hop", "rap", "r&b"].some((x) => g.includes(x))) suffixKey = "urban"
  else if (["ambient", "indie", "dream"].some((x) => g.includes(x))) suffixKey = "ethereal"
  else if (["metal", "rock", "punk"].some((x) => g.includes(x))) suffixKey = "intense"

  return { prefixPool: NAME_PREFIXES[prefixKey], suffixPool: NAME_SUFFIXES[suffixKey] }
}

function generateTraits(mood: MoodSpectrum): string[] {
  const traits: string[] = []
  traits.push(mood.energy > 65 ? "High-Energy" : mood.energy < 35 ? "Zen-Like" : "Balanced")
  traits.push(mood.happiness > 65 ? "Optimistic" : mood.happiness < 35 ? "Contemplative" : "Emotionally Nuanced")
  traits.push(mood.danceability > 65 ? "Groove-Driven" : "Introspective Listener")
  traits.push(mood.exploration > 60 ? "Adventurous" : "Deeply Rooted")
  traits.push(mood.acousticness > 60 ? "Organic Soul" : "Modern Ear")
  return traits.slice(0, 5)
}

export function generateAlterEgo(
  archetype: Archetype, mood: MoodSpectrum, genreDNA: GenreDNAEntry[], spotifyUserId?: string,
): AlterEgo {
  const topGenre = genreDNA[0]?.genre || "Pop"
  const seed = `${spotifyUserId || "demo"}-${archetype.id}-${topGenre}`
  const { prefixPool, suffixPool } = selectPools(mood, topGenre)
  const name = `${deterministicPick(prefixPool, seed + "p")} ${deterministicPick(suffixPool, seed + "s")}`
  const titles = TITLE_TEMPLATES[archetype.id] || ["The Sonic Enigma"]
  const title = deterministicPick(titles, seed + "t")
  const energyDesc = mood.energy > 70 ? "thrives on high-octane energy" : mood.energy > 40 ? "balances intensity with calm" : "finds power in stillness"
  const happyDesc = mood.happiness > 70 ? "radiates infectious joy" : mood.happiness > 40 ? "navigates the full emotional spectrum" : "embraces the beauty of melancholy"
  const description = `Your alter ego ${energyDesc} and ${happyDesc}. A ${topGenre}-infused soul, you embody the spirit of ${archetype.name}.`
  return { name, title, description, traits: generateTraits(mood) }
}
