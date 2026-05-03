import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { collectAnalysisData, refreshAccessToken } from "@/lib/spotify/api"
import { analyzePersonality } from "@/lib/personality/engine"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let accessToken: string
    let spotifyUserId: string | undefined
    let spotifyDisplayName: string | undefined
    let spotifyAvatarUrl: string | undefined

    if (user) {
      // Get stored tokens
      const { data: tokenData, error: tokenError } = await supabase
        .from("spotify_tokens")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (tokenError || !tokenData) {
        return NextResponse.json({ error: "Spotify not connected" }, { status: 400 })
      }

      // Check if token is expired and refresh if needed
      const isExpired = new Date(tokenData.expires_at) <= new Date()
      if (isExpired) {
        try {
          const newTokens = await refreshAccessToken(tokenData.refresh_token)
          const expiresAt = new Date(Date.now() + newTokens.expires_in * 1000).toISOString()

          await supabase
            .from("spotify_tokens")
            .update({
              access_token: newTokens.access_token,
              refresh_token: newTokens.refresh_token || tokenData.refresh_token,
              expires_at: expiresAt,
            })
            .eq("user_id", user.id)

          accessToken = newTokens.access_token
        } catch {
          return NextResponse.json({ error: "Failed to refresh token" }, { status: 401 })
        }
      } else {
        accessToken = tokenData.access_token
      }

      spotifyUserId = tokenData.spotify_user_id
      spotifyDisplayName = tokenData.spotify_display_name
      spotifyAvatarUrl = tokenData.spotify_avatar_url
    } else {
      // Check for token in request body (anonymous usage)
      const body = await request.json().catch(() => ({}))
      if (!body.accessToken) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
      }
      accessToken = body.accessToken
    }

    // Collect all Spotify data
    const data = await collectAnalysisData(accessToken)

    // Run personality analysis
    const result = analyzePersonality(
      data.allArtists,
      data.topTracksMedium,
      data.audioFeatures,
      spotifyUserId || data.profile.id,
      spotifyDisplayName || data.profile.display_name || undefined,
      spotifyAvatarUrl || data.profile.images?.[0]?.url || undefined,
    )

    // Store results in database if user is authenticated
    if (user) {
      const { data: savedResult, error: saveError } = await supabase
        .from("personality_results")
        .insert({
          user_id: user.id,
          archetype: result.archetype.id,
          archetype_score: result.archetypeScore,
          alter_ego_name: result.alterEgo.name,
          alter_ego_title: result.alterEgo.title,
          alter_ego_description: result.alterEgo.description,
          genre_dna: result.genreDNA,
          mood_spectrum: result.moodSpectrum,
          top_artists: result.topArtists,
          top_tracks: result.topTracks,
          audio_features_avg: result.audioFeaturesAvg,
          is_public: true,
        })
        .select("id")
        .single()

      if (saveError) {
        console.error("Failed to save personality results:", saveError)
      }

      return NextResponse.json({
        ...result,
        resultId: savedResult?.id || null,
      })
    }

    return NextResponse.json(result)
  } catch (err) {
    console.error("Analysis error:", err)
    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 },
    )
  }
}
