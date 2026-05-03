"use client"

/** Animated music visualizer background — CSS-only sound wave bars + floating particles */
export function MusicVisualizer() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-[120px] animate-float" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-purple-500/10 blur-[120px] animate-float" style={{ animationDelay: "1.5s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[150px]" />

      {/* Wave bars */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-1 h-16 opacity-20 px-8">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="wave-bar"
            style={{ animationDelay: `${i * 0.08}s`, opacity: 0.3 + Math.sin(i * 0.5) * 0.3 }}
          />
        ))}
      </div>

      {/* Floating dots */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={`dot-${i}`}
          className="absolute rounded-full bg-primary/20 animate-float"
          style={{
            width: `${3 + Math.random() * 4}px`,
            height: `${3 + Math.random() * 4}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
          }}
        />
      ))}
    </div>
  )
}

/** Compact wave bars for inline use */
export function WaveBars({ count = 5, className = "" }: { count?: number; className?: string }) {
  return (
    <div className={`flex items-end gap-0.5 h-5 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="wave-bar"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  )
}
