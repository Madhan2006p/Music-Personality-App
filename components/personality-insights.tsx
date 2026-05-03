"use client"

import type { AudioFeaturesAverage, PersonalityResult } from "@/lib/personality/types"

interface AudioFeaturesBreakdownProps {
  features: AudioFeaturesAverage
  archetypeColor: string
  className?: string
}

const FEATURE_INFO = [
  { key: "danceability" as const, label: "Danceability", icon: "💃", desc: "How suitable for dancing" },
  { key: "energy" as const, label: "Energy", icon: "⚡", desc: "Intensity and activity level" },
  { key: "valence" as const, label: "Positivity", icon: "☀️", desc: "Musical positiveness conveyed" },
  { key: "acousticness" as const, label: "Acousticness", icon: "🎸", desc: "Confidence of being acoustic" },
  { key: "instrumentalness" as const, label: "Instrumentalness", icon: "🎹", desc: "Predicts if a track has no vocals" },
  { key: "speechiness" as const, label: "Speechiness", icon: "🗣️", desc: "Presence of spoken words" },
  { key: "liveness" as const, label: "Liveness", icon: "🎤", desc: "Presence of a live audience" },
]

export function AudioFeaturesBreakdown({ features, archetypeColor, className = "" }: AudioFeaturesBreakdownProps) {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 ${className}`}>
      {FEATURE_INFO.map((feat, i) => {
        const value = features[feat.key]
        const pct = Math.round(value * 100)

        return (
          <div
            key={feat.key}
            className="relative p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] opacity-0 animate-fade-in-up group hover:bg-white/[0.04] transition-colors"
            style={{ animationDelay: `${i * 60}ms`, animationFillMode: "forwards" }}
          >
            <div className="text-2xl mb-2">{feat.icon}</div>
            <div className="text-2xl font-bold mb-0.5" style={{ color: archetypeColor }}>{pct}%</div>
            <div className="text-xs font-semibold text-foreground/60 mb-1">{feat.label}</div>
            <div className="text-[10px] text-foreground/25 leading-snug">{feat.desc}</div>

            {/* Mini progress ring */}
            <div className="absolute top-3 right-3 w-8 h-8">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="14" fill="none"
                  stroke={archetypeColor}
                  strokeWidth="3"
                  strokeDasharray={`${pct * 0.88} 88`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                  opacity="0.6"
                />
              </svg>
            </div>
          </div>
        )
      })}

      {/* Tempo card */}
      <div
        className="relative p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] opacity-0 animate-fade-in-up"
        style={{ animationDelay: `${FEATURE_INFO.length * 60}ms`, animationFillMode: "forwards" }}
      >
        <div className="text-2xl mb-2">🎵</div>
        <div className="text-2xl font-bold mb-0.5" style={{ color: archetypeColor }}>{features.tempo}</div>
        <div className="text-xs font-semibold text-foreground/60 mb-1">Avg BPM</div>
        <div className="text-[10px] text-foreground/25 leading-snug">
          {features.tempo > 140 ? "Fast-paced energy" : features.tempo > 110 ? "Mid-tempo groove" : "Slow & steady flow"}
        </div>
      </div>
    </div>
  )
}

/** Personality insights — fun stats and observations */
export function PersonalityInsights({ result }: { result: PersonalityResult }) {
  const insights = generateInsights(result)

  return (
    <div className="space-y-3">
      {insights.map((insight, i) => (
        <div
          key={i}
          className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] opacity-0 animate-slide-in"
          style={{ animationDelay: `${i * 100}ms`, animationFillMode: "forwards" }}
        >
          <span className="text-2xl shrink-0">{insight.emoji}</span>
          <div>
            <p className="text-sm font-semibold text-foreground/80 mb-1">{insight.title}</p>
            <p className="text-sm text-foreground/45 leading-relaxed">{insight.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

interface Insight {
  emoji: string
  title: string
  description: string
}

function generateInsights(result: PersonalityResult): Insight[] {
  const insights: Insight[] = []
  const { moodSpectrum, audioFeaturesAvg: avg, genreDNA, topArtists, archetype } = result

  // Energy insight
  if (moodSpectrum.energy > 75) {
    insights.push({
      emoji: "🚀",
      title: "You're a High-Octane Listener",
      description: "Your average energy level is in the top tier. You prefer music that matches your intensity — no elevator music for you.",
    })
  } else if (moodSpectrum.energy < 30) {
    insights.push({
      emoji: "🧘",
      title: "Master of Musical Calm",
      description: "You seek out sonic serenity. Your low energy preference suggests you use music for peace, focus, and introspection.",
    })
  }

  // Genre diversity
  if (genreDNA.length >= 5) {
    insights.push({
      emoji: "🌍",
      title: "Genre Explorer",
      description: `Your library spans ${genreDNA.length} distinct genres. You refuse to be boxed in — your curiosity drives you to explore widely.`,
    })
  } else if (genreDNA.length <= 2) {
    insights.push({
      emoji: "🎯",
      title: "Laser-Focused Taste",
      description: `With just ${genreDNA.length} primary genres, you've found your sonic home and you're committed. Quality over quantity.`,
    })
  }

  // Danceability
  if (avg.danceability > 0.7) {
    insights.push({
      emoji: "🪩",
      title: "Born to Dance",
      description: "Over 70% of your top tracks have high danceability scores. Your playlists are basically DJ sets waiting to happen.",
    })
  }

  // Vocal vs Instrumental
  if (avg.instrumentalness > 0.3) {
    insights.push({
      emoji: "🎻",
      title: "Instrumental Aficionado",
      description: "You have an unusual appreciation for instrumental music. While most listeners prefer vocals, you let the instruments tell the story.",
    })
  } else if (avg.speechiness > 0.15) {
    insights.push({
      emoji: "📝",
      title: "Lyrics Matter",
      description: "Your high speechiness score suggests you value lyrical content — rap, spoken word, and vocal-driven tracks feature heavily.",
    })
  }

  // Tempo insight
  if (avg.tempo > 140) {
    insights.push({
      emoji: "⏩",
      title: "Speed Demon",
      description: `Your average tempo is ${avg.tempo} BPM — well above the pop average of 120. You like your music fast and driving.`,
    })
  } else if (avg.tempo < 100) {
    insights.push({
      emoji: "🌊",
      title: "Slow Burn Specialist",
      description: `At ${avg.tempo} BPM average, you favor slower grooves that let the music breathe. Patient listening at its finest.`,
    })
  }

  // Artist loyalty
  if (topArtists.length > 0) {
    const topArtist = topArtists[0]
    insights.push({
      emoji: "👑",
      title: `${topArtist.name} Superfan`,
      description: `${topArtist.name} sits at the top of your listening. Their ${topArtist.genres.slice(0, 2).join(" & ") || "unique"} sound clearly resonates with your ${archetype.name} personality.`,
    })
  }

  // Valence
  if (avg.valence > 0.7) {
    insights.push({
      emoji: "☀️",
      title: "Sunshine in Audio Form",
      description: "Your valence score is exceptionally high — you actively seek out music that lifts your spirits and brightens your day.",
    })
  } else if (avg.valence < 0.3) {
    insights.push({
      emoji: "🌧️",
      title: "Beautifully Bittersweet",
      description: "Low valence doesn't mean sad — it means you appreciate emotional complexity. Your music has depth most listeners never explore.",
    })
  }

  return insights.slice(0, 5)
}
