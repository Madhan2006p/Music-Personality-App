/** Spotify Web API client functions */

import { SPOTIFY_CONFIG, SPOTIFY_ENDPOINTS } from "./config"
import type {
  SpotifyUser,
  SpotifyTrack,
  SpotifyArtist,
  AudioFeatures,
  SpotifyPaginatedResponse,
  SpotifyTokenResponse,
  TimeRange,
} from "./types"

class SpotifyApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "SpotifyApiError"
  }
}

async function spotifyFetch<T>(endpoint: string, token: string): Promise<T> {
  const response = await fetch(`${SPOTIFY_CONFIG.apiBaseUrl}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new SpotifyApiError(
      response.status,
      `Spotify API error: ${response.status} ${response.statusText}`,
    )
  }

  return response.json()
}

/** Get the current user's Spotify profile */
export async function getUserProfile(token: string): Promise<SpotifyUser> {
  return spotifyFetch<SpotifyUser>(SPOTIFY_ENDPOINTS.me, token)
}

/** Get the user's top tracks */
export async function getTopTracks(
  token: string,
  timeRange: TimeRange = "medium_term",
  limit: number = 50,
): Promise<SpotifyTrack[]> {
  const data = await spotifyFetch<SpotifyPaginatedResponse<SpotifyTrack>>(
    `${SPOTIFY_ENDPOINTS.topTracks}?time_range=${timeRange}&limit=${limit}`,
    token,
  )
  return data.items
}

/** Get the user's top artists */
export async function getTopArtists(
  token: string,
  timeRange: TimeRange = "medium_term",
  limit: number = 50,
): Promise<SpotifyArtist[]> {
  const data = await spotifyFetch<SpotifyPaginatedResponse<SpotifyArtist>>(
    `${SPOTIFY_ENDPOINTS.topArtists}?time_range=${timeRange}&limit=${limit}`,
    token,
  )
  return data.items
}

/** Get audio features for multiple tracks (max 100 per request) */
export async function getAudioFeatures(
  token: string,
  trackIds: string[],
): Promise<AudioFeatures[]> {
  if (trackIds.length === 0) return []

  // Spotify API allows max 100 IDs per request
  const batches: string[][] = []
  for (let i = 0; i < trackIds.length; i += 100) {
    batches.push(trackIds.slice(i, i + 100))
  }

  const allFeatures: AudioFeatures[] = []
  for (const batch of batches) {
    const data = await spotifyFetch<{ audio_features: (AudioFeatures | null)[] }>(
      `${SPOTIFY_ENDPOINTS.audioFeatures}?ids=${batch.join(",")}`,
      token,
    )
    allFeatures.push(...data.audio_features.filter((f): f is AudioFeatures => f !== null))
  }

  return allFeatures
}

/** Exchange authorization code for tokens */
export async function exchangeCodeForTokens(
  code: string,
): Promise<SpotifyTokenResponse> {
  const response = await fetch(SPOTIFY_CONFIG.tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
      ).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: SPOTIFY_CONFIG.redirectUri,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new SpotifyApiError(response.status, `Token exchange failed: ${error}`)
  }

  return response.json()
}

/** Refresh an expired access token */
export async function refreshAccessToken(
  refreshToken: string,
): Promise<SpotifyTokenResponse> {
  const response = await fetch(SPOTIFY_CONFIG.tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
      ).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new SpotifyApiError(response.status, `Token refresh failed: ${error}`)
  }

  return response.json()
}

/** Collect all data needed for personality analysis */
export async function collectAnalysisData(token: string) {
  const [
    profile,
    topTracksShort,
    topTracksMedium,
    topArtistsShort,
    topArtistsMedium,
  ] = await Promise.all([
    getUserProfile(token),
    getTopTracks(token, "short_term", 50),
    getTopTracks(token, "medium_term", 50),
    getTopArtists(token, "short_term", 50),
    getTopArtists(token, "medium_term", 50),
  ])

  // Merge and deduplicate tracks
  const trackMap = new Map<string, SpotifyTrack>()
  topTracksShort.forEach((t) => trackMap.set(t.id, t))
  topTracksMedium.forEach((t) => trackMap.set(t.id, t))
  const allTracks = Array.from(trackMap.values())

  // Merge and deduplicate artists
  const artistMap = new Map<string, SpotifyArtist>()
  topArtistsShort.forEach((a) => artistMap.set(a.id, a))
  topArtistsMedium.forEach((a) => artistMap.set(a.id, a))
  const allArtists = Array.from(artistMap.values())

  // Get audio features for all tracks
  const audioFeatures = await getAudioFeatures(
    token,
    allTracks.map((t) => t.id),
  )

  return {
    profile,
    topTracksShort,
    topTracksMedium,
    topArtistsShort,
    topArtistsMedium,
    allTracks,
    allArtists,
    audioFeatures,
  }
}
