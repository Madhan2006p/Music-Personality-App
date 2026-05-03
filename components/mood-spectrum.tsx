"use client"

import type { MoodSpectrum as MoodSpectrumType } from "@/lib/personality/types"
import { useEffect, useState } from "react"

interface MoodSpectrumProps {
  data: MoodSpectrumType
  className?: string
}

const MOOD_DIMENSIONS = [
  {
    key: "energy" as const,
    labelLow: "Calm",
    labelHigh: "Energetic",
    color: "#FF6B35",
    icon: "⚡",
    getInsight: (v: number) =>
      v > 70 ? "You thrive on high-energy tracks that get your adrenaline pumping."
      : v > 40 ? "You enjoy a balanced mix — high energy when you need it, calm when you don't."
      : "You gravitate toward tranquil, meditative soundscapes that slow the world down.",
  },
  {
    key: "happiness" as const,
    labelLow: "Melancholy",
    labelHigh: "Joyful",
    color: "#FFE66D",
    icon: "🌟",
    getInsight: (v: number) =>
      v > 70 ? "Your playlists radiate positivity — upbeat, major-key anthems dominate."
      : v > 40 ? "You embrace the full emotional range, from bittersweet ballads to euphoric highs."
      : "You're drawn to emotionally complex, introspective music with depth and nuance.",
  },
  {
    key: "danceability" as const,
    labelLow: "Still",
    labelHigh: "Groovy",
    color: "#1DB954",
    icon: "💃",
    getInsight: (v: number) =>
      v > 70 ? "Your body can't help but move — rhythm and groove drive your listening."
      : v > 40 ? "You appreciate a good beat, but you're not limited to dance-floor-ready tracks."
      : "Rhythm takes a backseat to melody, texture, and atmosphere in your taste.",
  },
  {
    key: "intensity" as const,
    labelLow: "Gentle",
    labelHigh: "Intense",
    color: "#FF4757",
    icon: "🔥",
    getInsight: (v: number) =>
      v > 70 ? "You crave sonic power — loud, fast, and unapologetically intense."
      : v > 40 ? "A balanced listener who enjoys both gentle moments and powerful crescendos."
      : "You prefer subtlety and restraint — music that whispers rather than shouts.",
  },
  {
    key: "exploration" as const,
    labelLow: "Familiar",
    labelHigh: "Experimental",
    color: "#9B59B6",
    icon: "🔮",
    getInsight: (v: number) =>
      v > 70 ? "You're a musical explorer — always seeking uncharted sonic territory."
      : v > 40 ? "You branch out occasionally but also cherish your comfort zone."
      : "You know what you love and you stick with it — loyalty to your favorites.",
  },
  {
    key: "acousticness" as const,
    labelLow: "Electronic",
    labelHigh: "Acoustic",
    color: "#4ECDC4",
    icon: "🎸",
    getInsight: (v: number) =>
      v > 70 ? "Organic instruments and raw vocal performances resonate deeply with you."
      : v > 40 ? "You appreciate both synthesizers and strings — production style is secondary to feel."
      : "You lean toward modern production, electronic textures, and digital soundscapes.",
  },
]

export function MoodSpectrumChart({ data, className = "" }: MoodSpectrumProps) {
  const [animated, setAnimated] = useState(false)
  const [expandedDim, setExpandedDim] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`space-y-1 ${className}`}>
      {MOOD_DIMENSIONS.map((dim, i) => {
        const value = data[dim.key]
        const isExpanded = expandedDim === dim.key

        return (
          <div
            key={dim.key}
            className="opacity-0 animate-fade-in-up cursor-pointer rounded-xl p-4 transition-colors hover:bg-white/[0.02]"
            style={{ animationDelay: `${i * 80}ms`, animationFillMode: "forwards" }}
            onClick={() => setExpandedDim(isExpanded ? null : dim.key)}
          >
            {/* Header row with icon */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{dim.icon}</span>
              <span className="text-sm font-semibold text-foreground/70 flex-1">
                {dim.key.charAt(0).toUpperCase() + dim.key.slice(1)}
              </span>
              <span className="text-sm font-bold" style={{ color: dim.color }}>
                {value}%
              </span>
            </div>

            {/* Labels */}
            <div className="flex justify-between mb-1.5 px-1">
              <span className="text-[11px] text-muted-foreground/60">{dim.labelLow}</span>
              <span className="text-[11px] text-muted-foreground/60">{dim.labelHigh}</span>
            </div>

            {/* Bar */}
            <div className="relative h-2.5 rounded-full bg-white/[0.04] overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: animated ? `${value}%` : "0%",
                  background: `linear-gradient(90deg, ${dim.color}30, ${dim.color})`,
                  transitionDelay: `${i * 80 + 200}ms`,
                }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 border-background transition-all duration-1000 ease-out"
                style={{
                  left: animated ? `calc(${value}% - 7px)` : "-7px",
                  backgroundColor: dim.color,
                  transitionDelay: `${i * 80 + 200}ms`,
                  boxShadow: `0 0 10px ${dim.color}60`,
                }}
              />
            </div>

            {/* Expanded insight */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-out ${isExpanded ? "max-h-20 opacity-100 mt-3" : "max-h-0 opacity-0"}`}
            >
              <p className="text-sm text-foreground/50 leading-relaxed pl-8">
                {dim.getInsight(value)}
              </p>
            </div>
          </div>
        )
      })}

      <p className="text-xs text-center text-foreground/20 pt-2">
        Tap any dimension to see your insight
      </p>
    </div>
  )
}
