import { NextRequest, NextResponse } from "next/server"
import { exchangeCodeForTokens, getUserProfile } from "@/lib/spotify/api"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const error = searchParams.get("error")
  const state = searchParams.get("state")

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  if (error) {
    return NextResponse.redirect(`${baseUrl}/?error=spotify_auth_denied`)
  }

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/?error=no_code`)
  }

  try {
    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code)

    // Get Spotify user profile
    const spotifyProfile = await getUserProfile(tokens.access_token)

    // Get Supabase user
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      // Store tokens in database
      const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString()

      const { error: upsertError } = await supabase
        .from("spotify_tokens")
        .upsert({
          user_id: user.id,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expires_at: expiresAt,
          spotify_user_id: spotifyProfile.id,
          spotify_display_name: spotifyProfile.display_name,
          spotify_avatar_url: spotifyProfile.images?.[0]?.url || null,
        }, { onConflict: "user_id" })

      if (upsertError) {
        console.error("Failed to store Spotify tokens:", upsertError)
        return NextResponse.redirect(`${baseUrl}/?error=token_storage_failed`)
      }

      return NextResponse.redirect(`${baseUrl}/analyze`)
    }

    // If no Supabase user, store tokens in URL params temporarily
    const params = new URLSearchParams({
      spotify_token: tokens.access_token,
      spotify_refresh: tokens.refresh_token,
      spotify_expires: tokens.expires_in.toString(),
      spotify_user: spotifyProfile.id,
      spotify_name: spotifyProfile.display_name || "",
    })

    return NextResponse.redirect(`${baseUrl}/analyze?${params.toString()}`)
  } catch (err) {
    console.error("Spotify callback error:", err)
    return NextResponse.redirect(`${baseUrl}/?error=spotify_callback_failed`)
  }
}
