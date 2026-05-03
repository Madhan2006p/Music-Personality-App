"use client"

import type { Archetype } from "@/lib/personality/types"

interface ArchetypeCardProps {
  archetype: Archetype
  score?: number
  size?: "sm" | "lg"
  className?: string
}

export function ArchetypeCard({ archetype, score, size = "lg", className = "" }: ArchetypeCardProps) {
  const isLarge = size === "lg"

  return (
    <div
      id="archetype-card"
      className={`
        relative overflow-hidden rounded-2xl
        ${isLarge ? "p-8 md:p-12" : "p-5"}
        animate-scale-in
        ${className}
      `}
      style={{
        background: `linear-gradient(135deg, ${archetype.gradientFrom}20, ${archetype.gradientTo}10)`,
        borderColor: `${archetype.color}30`,
        borderWidth: "1px",
        borderStyle: "solid",
      }}
    >
      {/* Background glow */}
      <div
        className="absolute top-0 right-0 w-1/2 h-full opacity-10 blur-[80px]"
        style={{ background: archetype.color }}
      />

      <div className="relative z-10">
        <div className={`${isLarge ? "text-6xl mb-4" : "text-3xl mb-2"}`}>
          {archetype.emoji}
        </div>

        <h2
          className={`font-bold ${isLarge ? "text-4xl md:text-5xl mb-2" : "text-xl mb-1"}`}
          style={{ color: archetype.color }}
        >
          {archetype.name}
        </h2>

        <p className={`text-muted-foreground italic ${isLarge ? "text-lg mb-6" : "text-sm mb-3"}`}>
          &ldquo;{archetype.tagline}&rdquo;
        </p>

        <p className={`text-foreground/80 leading-relaxed ${isLarge ? "text-lg max-w-xl" : "text-sm"}`}>
          {archetype.description}
        </p>

        {score !== undefined && (
          <div className="mt-4 flex items-center gap-2">
            <div className="h-2 flex-1 max-w-48 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${Math.round(score * 100)}%`,
                  background: `linear-gradient(90deg, ${archetype.gradientFrom}, ${archetype.gradientTo})`,
                }}
              />
            </div>
            <span className="text-sm text-muted-foreground">{Math.round(score * 100)}% match</span>
          </div>
        )}
      </div>
    </div>
  )
}
