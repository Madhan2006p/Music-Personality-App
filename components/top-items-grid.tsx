"use client"

import type { ArtistSummary, TrackSummary } from "@/lib/personality/types"
import Image from "next/image"

interface TopItemsGridProps {
  artists?: ArtistSummary[]
  tracks?: TrackSummary[]
  className?: string
}

export function TopArtistsGrid({ artists = [], className = "" }: { artists: ArtistSummary[]; className?: string }) {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 ${className}`}>
      {artists.map((artist, i) => (
        <div
          key={artist.id}
          className="group flex flex-col items-center gap-2 opacity-0 animate-fade-in-up"
          style={{ animationDelay: `${i * 80}ms`, animationFillMode: "forwards" }}
        >
          <div className="relative w-20 h-20 rounded-full overflow-hidden bg-white/5 ring-2 ring-white/5 group-hover:ring-primary/30 transition-all">
            {artist.imageUrl ? (
              <Image
                src={artist.imageUrl}
                alt={artist.name}
                fill
                className="object-cover"
                sizes="80px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl text-muted-foreground">
                🎤
              </div>
            )}
          </div>
          <span className="text-xs text-center text-foreground/70 group-hover:text-foreground transition-colors line-clamp-2">
            {artist.name}
          </span>
        </div>
      ))}
    </div>
  )
}

export function TopTracksGrid({ tracks = [], className = "" }: { tracks: TrackSummary[]; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {tracks.map((track, i) => (
        <div
          key={track.id}
          className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] transition-colors opacity-0 animate-slide-in"
          style={{ animationDelay: `${i * 60}ms`, animationFillMode: "forwards" }}
        >
          <span className="text-xs text-muted-foreground w-5 text-right shrink-0">
            {i + 1}
          </span>
          <div className="relative w-10 h-10 rounded overflow-hidden bg-white/5 shrink-0">
            {track.albumArt ? (
              <Image
                src={track.albumArt}
                alt={track.name}
                fill
                className="object-cover"
                sizes="40px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm">🎵</div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">{track.name}</p>
            <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
