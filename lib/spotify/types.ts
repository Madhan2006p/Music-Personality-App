/** Spotify Web API TypeScript interfaces */

export interface SpotifyUser {
  id: string
  display_name: string | null
  email: string
  images: SpotifyImage[]
  country: string
  product: string
}

export interface SpotifyImage {
  url: string
  height: number | null
  width: number | null
}

export interface SpotifyTrack {
  id: string
  name: string
  artists: SpotifyArtistSimple[]
  album: SpotifyAlbum
  popularity: number
  duration_ms: number
  preview_url: string | null
  external_urls: { spotify: string }
}

export interface SpotifyArtistSimple {
  id: string
  name: string
  external_urls: { spotify: string }
}

export interface SpotifyArtist {
  id: string
  name: string
  genres: string[]
  images: SpotifyImage[]
  popularity: number
  followers: { total: number }
  external_urls: { spotify: string }
}

export interface SpotifyAlbum {
  id: string
  name: string
  images: SpotifyImage[]
  release_date: string
  external_urls: { spotify: string }
}

export interface AudioFeatures {
  id: string
  danceability: number
  energy: number
  key: number
  loudness: number
  mode: number
  speechiness: number
  acousticness: number
  instrumentalness: number
  liveness: number
  valence: number
  tempo: number
  duration_ms: number
  time_signature: number
}

export interface SpotifyPaginatedResponse<T> {
  items: T[]
  total: number
  limit: number
  offset: number
  next: string | null
  previous: string | null
}

export interface SpotifyTokenResponse {
  access_token: string
  token_type: string
  scope: string
  expires_in: number
  refresh_token: string
}

export type TimeRange = "short_term" | "medium_term" | "long_term"
