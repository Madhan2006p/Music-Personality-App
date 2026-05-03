"use client"

import type { MoodSpectrum as MoodSpectrumType } from "@/lib/personality/types"
import { useEffect, useState } from "react"

interface MoodSpectrumProps {
  data: MoodSpectrumType
  className?: string
}

const MOOD_DIMENSIONS = [
  { key: "energy" as const, labelLow: "Calm", labelHigh: "Energetic", color: "#FF6B35" },
  { key: "happiness" as const, labelLow: "Melancholy", labelHigh: "Joyful", color: "#FFE66D" },
  { key: "danceability" as const, labelLow: "Still", labelHigh: "Groovy", color: "#1DB954" },
  { key: "intensity" as const, labelLow: "Gentle", labelHigh: "Intense", color: "#FF4757" },
  { key: "exploration" as const, labelLow: "Familiar", labelHigh: "Experimental", color: "#9B59B6" },
  { key: "acousticness" as const, labelLow: "Electronic", labelHigh: "Acoustic", color: "#4ECDC4" },
]

export function MoodSpectrumChart({ data, className = "" }: MoodSpectrumProps) {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`space-y-5 ${className}`}>
      {MOOD_DIMENSIONS.map((dim, i) => {
        const value = data[dim.key]
        return (
          <div
            key={dim.key}
            className="opacity-0 animate-fade-in-up"
            style={{ animationDelay: `${i * 100}ms`, animationFillMode: "forwards" }}
          >
            <div className="flex justify-between mb-1.5">
              <span className="text-xs text-muted-foreground">{dim.labelLow}</span>
              <span className="text-xs text-muted-foreground">{dim.labelHigh}</span>
            </div>
            <div className="relative h-3 rounded-full bg-white/5 overflow-hidden">
              {/* Gradient fill */}
              <div
                className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: animated ? `${value}%` : "0%",
                  background: `linear-gradient(90deg, ${dim.color}40, ${dim.color})`,
                  transitionDelay: `${i * 100 + 200}ms`,
                }}
              />
              {/* Indicator dot */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-background transition-all duration-1000 ease-out"
                style={{
                  left: animated ? `calc(${value}% - 6px)` : "-6px",
                  backgroundColor: dim.color,
                  transitionDelay: `${i * 100 + 200}ms`,
                  boxShadow: `0 0 8px ${dim.color}80`,
                }}
              />
            </div>
            <div className="text-right mt-1">
              <span className="text-xs font-semibold" style={{ color: dim.color }}>
                {value}%
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
