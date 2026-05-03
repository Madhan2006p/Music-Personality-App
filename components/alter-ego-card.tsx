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
      className={`relative overflow-hidden rounded-3xl animate-scale-in ${className}`}
    >
      {/* Multi-layer background */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${archetypeColor}08, transparent 60%)` }} />
      <div className="absolute inset-0 glass-strong" />

      {/* Decorative dot grid */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="alter-ego-dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill={archetypeColor} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#alter-ego-dots)" />
        </svg>
      </div>

      {/* Corner glow */}
      <div
        className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-[120px] opacity-10"
        style={{ background: archetypeColor }}
      />

      <div className="relative z-10 p-8 md:p-10">
        {/* Label */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
          style={{ backgroundColor: `${archetypeColor}12`, color: archetypeColor, border: `1px solid ${archetypeColor}20` }}
        >
          <span className="text-base">✨</span> Your Music Alter Ego
        </div>

        {/* Name + Title */}
        <h3
          className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2"
          style={{ color: archetypeColor }}
        >
          {alterEgo.name}
        </h3>
        <p className="text-xl text-foreground/50 italic font-light mb-6">
          {alterEgo.title}
        </p>

        {/* Separator */}
        <div className="w-16 h-0.5 rounded-full mb-6" style={{ background: `${archetypeColor}30` }} />

        {/* Description */}
        <p className="text-foreground/65 leading-relaxed text-lg mb-8 max-w-xl">
          {alterEgo.description}
        </p>

        {/* Traits as premium pills */}
        <div>
          <p className="text-xs uppercase tracking-widest text-foreground/30 mb-3">Core Traits</p>
          <div className="flex flex-wrap gap-2.5">
            {alterEgo.traits.map((trait, i) => (
              <span
                key={trait}
                className="px-4 py-2 rounded-full text-sm font-medium opacity-0 animate-fade-in-up"
                style={{
                  backgroundColor: `${archetypeColor}10`,
                  color: archetypeColor,
                  border: `1px solid ${archetypeColor}20`,
                  animationDelay: `${i * 80 + 200}ms`,
                  animationFillMode: "forwards",
                }}
              >
                {trait}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
