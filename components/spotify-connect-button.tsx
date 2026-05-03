"use client"

import { Button } from "@/components/ui/button"
import { WaveBars } from "@/components/music-visualizer"

interface SpotifyConnectButtonProps {
  onClick?: () => void
  isLoading?: boolean
  size?: "default" | "lg"
  className?: string
}

export function SpotifyConnectButton({
  onClick,
  isLoading = false,
  size = "lg",
  className = "",
}: SpotifyConnectButtonProps) {
  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      window.location.href = "/api/spotify/login"
    }
  }

  return (
    <Button
      id="spotify-connect-btn"
      onClick={handleClick}
      disabled={isLoading}
      size={size}
      className={`
        relative overflow-hidden
        bg-[#1DB954] hover:bg-[#1ED760] text-black font-semibold
        px-8 py-6 text-lg rounded-full
        transition-all duration-300
        hover:scale-105 hover:shadow-[0_0_30px_rgba(29,185,84,0.4)]
        active:scale-95
        disabled:opacity-50 disabled:hover:scale-100
        ${className}
      `}
    >
      {isLoading ? (
        <div className="flex items-center gap-3">
          <WaveBars count={4} />
          <span>Connecting...</span>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          {/* Spotify logo SVG */}
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381C8.64 5.801 15.72 6.001 20.1 8.82c.54.3.72 1.02.42 1.56-.299.421-1.02.599-1.44.3z" />
          </svg>
          <span>Connect with Spotify</span>
        </div>
      )}
    </Button>
  )
}
