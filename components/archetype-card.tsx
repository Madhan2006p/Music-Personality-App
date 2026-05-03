"use client"

import type { Archetype } from "@/lib/personality/types"

interface ArchetypeCardProps {
  archetype: Archetype
  score?: number
  allScores?: Record<string, number>
  className?: string
}

export function ArchetypeCard({ archetype, score, allScores, className = "" }: ArchetypeCardProps) {
  // Get runner-up archetypes for the comparison section
  const sortedScores = allScores
    ? Object.entries(allScores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
    : []

  return (
    <div
      id="archetype-card"
      className={`relative overflow-hidden rounded-3xl animate-scale-in ${className}`}
      style={{
        background: `linear-gradient(160deg, ${archetype.gradientFrom}18, ${archetype.gradientTo}08, transparent)`,
        borderColor: `${archetype.color}25`,
        borderWidth: "1px",
        borderStyle: "solid",
      }}
    >
      {/* Background decorative elements */}
      <div
        className="absolute top-0 right-0 w-2/3 h-full opacity-[0.07] blur-[100px]"
        style={{ background: `radial-gradient(circle at 70% 30%, ${archetype.color}, transparent 70%)` }}
      />
      <div
        className="absolute bottom-0 left-0 w-1/2 h-1/2 opacity-[0.04] blur-[80px]"
        style={{ background: archetype.gradientTo }}
      />

      {/* Main content */}
      <div className="relative z-10 p-8 md:p-12">
        {/* Top badge */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest"
            style={{ backgroundColor: `${archetype.color}15`, color: archetype.color, border: `1px solid ${archetype.color}25` }}
          >
            Primary Archetype
          </div>
          {score !== undefined && (
            <div className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-foreground/50">
              {Math.round(score * 100)}% Match
            </div>
          )}
        </div>

        {/* Emoji + Name */}
        <div className="flex items-start gap-5 mb-6">
          <div className="text-6xl md:text-7xl shrink-0 mt-1">{archetype.emoji}</div>
          <div>
            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none mb-2"
              style={{ color: archetype.color }}
            >
              {archetype.name}
            </h2>
            <p className="text-lg md:text-xl text-foreground/40 italic font-light">
              &ldquo;{archetype.tagline}&rdquo;
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-lg text-foreground/70 leading-relaxed max-w-2xl mb-8">
          {archetype.description}
        </p>

        {/* Score bar */}
        {score !== undefined && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-foreground/40">Archetype Strength</span>
              <span className="text-sm font-bold" style={{ color: archetype.color }}>
                {Math.round(score * 100)}%
              </span>
            </div>
            <div className="h-3 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1500 ease-out"
                style={{
                  width: `${Math.round(score * 100)}%`,
                  background: `linear-gradient(90deg, ${archetype.gradientFrom}, ${archetype.gradientTo})`,
                  boxShadow: `0 0 20px ${archetype.color}40`,
                }}
              />
            </div>
          </div>
        )}

        {/* Runner-up archetypes comparison */}
        {sortedScores.length > 1 && (
          <div className="pt-6 border-t border-white/5">
            <p className="text-xs uppercase tracking-widest text-foreground/30 mb-4">
              Your Archetype Spectrum
            </p>
            <div className="space-y-3">
              {sortedScores.map(([id, s], i) => {
                const isWinner = i === 0
                return (
                  <div key={id} className="flex items-center gap-3">
                    <span className={`text-xs w-28 truncate ${isWinner ? "text-foreground font-semibold" : "text-foreground/40"}`}>
                      {id.replace("the-", "The ").replace(/-/g, "")}
                    </span>
                    <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.round(s * 100)}%`,
                          background: isWinner
                            ? `linear-gradient(90deg, ${archetype.gradientFrom}, ${archetype.gradientTo})`
                            : "rgba(255,255,255,0.15)",
                          transitionDelay: `${i * 100}ms`,
                        }}
                      />
                    </div>
                    <span className={`text-xs w-8 text-right ${isWinner ? "font-bold" : "text-foreground/30"}`}
                      style={isWinner ? { color: archetype.color } : undefined}
                    >
                      {Math.round(s * 100)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
