/** Spotify OAuth and API configuration */

export const SPOTIFY_CONFIG = {
  authUrl: "https://accounts.spotify.com/authorize",
  tokenUrl: "https://accounts.spotify.com/api/token",
  apiBaseUrl: "https://api.spotify.com/v1",
  scopes: [
    "user-read-private",
    "user-read-email",
    "user-top-read",
    "user-read-recently-played",
  ].join(" "),
  redirectUri: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/spotify/callback`,
} as const

export const SPOTIFY_ENDPOINTS = {
  me: "/me",
  topTracks: "/me/top/tracks",
  topArtists: "/me/top/artists",
  audioFeatures: "/audio-features",
  recentlyPlayed: "/me/player/recently-played",
} as const
