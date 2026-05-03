"use client"

import type { AlterEgo } from "@/lib/personality/types"

interface AlterEgoCardProps {
  alterEgo: AlterEgo
  archetypeColor?: string
  className?: string
}

export function AlterEgoCard({ alterEgo, archetypeColor = "#1DB954", className = "" }: AlterEgoCardProps) {
  return (
    <div
      id="alter-ego-card"
      className={`
        relative overflow-hidden rounded-2xl p-8 md:p-10
        glass-strong animate-scale-in
        ${className}
      `}
      style={{
        borderColor: `${archetypeColor}20`,
      }}
    >
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="alter-ego-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="1.5" fill={archetypeColor} />
              <circle cx="0" cy="0" r="1" fill={archetypeColor} />
              <circle cx="60" cy="60" r="1" fill={archetypeColor} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#alter-ego-pattern)" />
        </svg>
      </div>

      {/* Glow */}
      <div
        className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-[100px] opacity-15"
        style={{ background: archetypeColor }}
      />

      <div className="relative z-10">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
          Your Music Alter Ego
        </p>

        <h3
          className="text-3xl md:text-4xl font-bold mb-1"
          style={{ color: archetypeColor }}
        >
          {alterEgo.name}
        </h3>

        <p className="text-lg text-foreground/60 italic mb-5">
          {alterEgo.title}
        </p>

        <p className="text-foreground/70 leading-relaxed mb-6 max-w-lg">
          {alterEgo.description}
        </p>

        {/* Traits */}
        <div className="flex flex-wrap gap-2">
          {alterEgo.traits.map((trait) => (
            <span
              key={trait}
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: `${archetypeColor}15`,
                color: archetypeColor,
                border: `1px solid ${archetypeColor}30`,
              }}
            >
              {trait}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
