"use client"

import type { GenreDNAEntry } from "@/lib/personality/types"
import { useEffect, useState } from "react"

interface GenreDNAChartProps {
  data: GenreDNAEntry[]
  size?: number
  className?: string
}

/** Genre descriptions for context */
const GENRE_DESCRIPTIONS: Record<string, string> = {
  "Pop": "Catchy melodies, polished production, and universal appeal",
  "Rock": "Guitar-driven energy, raw emotion, and rebellious spirit",
  "Hip-Hop": "Rhythmic vocals, lyrical storytelling, and beat-driven culture",
  "Electronic": "Synthesized sounds, digital production, and club-ready beats",
  "R&B": "Smooth vocals, groove-heavy rhythms, and emotional depth",
  "Metal": "Extreme intensity, technical mastery, and sonic aggression",
  "Jazz": "Improvisation, harmonic complexity, and expressive freedom",
  "Classical": "Orchestral grandeur, compositional mastery, and timeless beauty",
  "Folk": "Acoustic intimacy, storytelling tradition, and earthy warmth",
  "Country": "Narrative songwriting, roots instrumentation, and heartland soul",
  "Latin": "Rhythmic diversity, passionate energy, and cultural richness",
  "World": "Global sounds, cross-cultural fusion, and sonic exploration",
  "Other": "Unique sounds beyond conventional genre boundaries",
}

export function GenreDNAChart({ data, size = 280, className = "" }: GenreDNAChartProps) {
  const [animated, setAnimated] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const centerX = size / 2
  const centerY = size / 2
  const radius = size / 2 - 20
  const innerRadius = radius * 0.55

  let currentAngle = -90

  const segments = data.map((entry) => {
    const angle = (entry.percentage / 100) * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + angle
    currentAngle = endAngle

    const startRad = (startAngle * Math.PI) / 180
    const endRad = (endAngle * Math.PI) / 180

    const x1O = centerX + radius * Math.cos(startRad)
    const y1O = centerY + radius * Math.sin(startRad)
    const x2O = centerX + radius * Math.cos(endRad)
    const y2O = centerY + radius * Math.sin(endRad)
    const x1I = centerX + innerRadius * Math.cos(endRad)
    const y1I = centerY + innerRadius * Math.sin(endRad)
    const x2I = centerX + innerRadius * Math.cos(startRad)
    const y2I = centerY + innerRadius * Math.sin(startRad)

    const largeArc = angle > 180 ? 1 : 0
    const path = `M ${x1O} ${y1O} A ${radius} ${radius} 0 ${largeArc} 1 ${x2O} ${y2O} L ${x1I} ${y1I} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x2I} ${y2I} Z`

    return { ...entry, path }
  })

  const topGenre = data[0]
  const dominanceLevel = topGenre?.percentage > 40 ? "dominant" : topGenre?.percentage > 25 ? "leading" : "balanced"

  return (
    <div className={`${className}`}>
      {/* Chart + Legend row */}
      <div className="flex flex-col md:flex-row items-center gap-10">
        {/* Donut chart */}
        <div className="relative shrink-0" style={{ width: size, height: size }}>
          <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="drop-shadow-lg">
            {segments.map((seg, i) => (
              <path
                key={seg.genre}
                d={seg.path}
                fill={seg.color}
                opacity={animated ? (hoveredIndex !== null && hoveredIndex !== i ? 0.4 : 0.85) : 0}
                className="transition-all duration-500 ease-out cursor-pointer"
                style={{ transitionDelay: hoveredIndex !== null ? "0ms" : `${i * 80}ms` }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <title>{`${seg.genre}: ${seg.percentage}%`}</title>
              </path>
            ))}
            {/* Center content */}
            {hoveredIndex !== null ? (
              <>
                <text x={centerX} y={centerY - 12} textAnchor="middle" fill={segments[hoveredIndex].color} fontSize="28" fontWeight="800">
                  {segments[hoveredIndex].percentage}%
                </text>
                <text x={centerX} y={centerY + 14} textAnchor="middle" fill="white" fontSize="12" fontWeight="500" opacity="0.6">
                  {segments[hoveredIndex].genre}
                </text>
              </>
            ) : (
              <>
                <text x={centerX} y={centerY - 8} textAnchor="middle" fill="white" fontSize="14" fontWeight="600" opacity="0.7">
                  Genre
                </text>
                <text x={centerX} y={centerY + 12} textAnchor="middle" fill="white" fontSize="12" fontWeight="400" opacity="0.4">
                  DNA
                </text>
              </>
            )}
          </svg>
        </div>

        {/* Legend with descriptions */}
        <div className="flex flex-col gap-3 flex-1 min-w-0">
          {data.map((entry, i) => (
            <div
              key={entry.genre}
              className="group flex items-start gap-3 opacity-0 animate-slide-in cursor-pointer rounded-lg p-2 -m-2 hover:bg-white/[0.02] transition-colors"
              style={{ animationDelay: `${i * 60 + 200}ms`, animationFillMode: "forwards" }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className="w-3 h-3 rounded-full shrink-0 mt-1.5 ring-2 ring-transparent group-hover:ring-white/10 transition-all"
                style={{ backgroundColor: entry.color }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground/80">{entry.genre}</span>
                  <span className="text-sm font-bold" style={{ color: entry.color }}>{entry.percentage}%</span>
                </div>
                <p className="text-xs text-foreground/30 mt-0.5 leading-relaxed">
                  {GENRE_DESCRIPTIONS[entry.genre] || "A unique part of your sonic identity"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary insight */}
      <div className="mt-8 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
        <p className="text-sm text-foreground/50 leading-relaxed">
          <span className="font-semibold text-foreground/70">Your Musical Palette: </span>
          {dominanceLevel === "dominant"
            ? `${topGenre.genre} clearly dominates your listening at ${topGenre.percentage}%. You know what you love and lean into it heavily.`
            : dominanceLevel === "leading"
              ? `${topGenre.genre} leads your palette at ${topGenre.percentage}%, but you maintain a healthy diversity across ${data.length} genres.`
              : `Your taste is remarkably diverse across ${data.length} genres. No single genre dominates — you're a true musical omnivore.`}
        </p>
      </div>
    </div>
  )
}
