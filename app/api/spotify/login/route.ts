import { NextResponse } from "next/server"
import { SPOTIFY_CONFIG } from "@/lib/spotify/config"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Generate a state parameter to prevent CSRF
  const state = crypto.randomUUID()

  // Store state in a cookie for validation on callback
  const params = new URLSearchParams({
    client_id: process.env.SPOTIFY_CLIENT_ID!,
    response_type: "code",
    redirect_uri: SPOTIFY_CONFIG.redirectUri,
    scope: SPOTIFY_CONFIG.scopes,
    state,
    show_dialog: "true",
  })

  // If user is logged in, include their ID in state for linking
  const stateData = user ? `${state}:${user.id}` : state

  params.set("state", stateData)

  const authUrl = `${SPOTIFY_CONFIG.authUrl}?${params.toString()}`

  return NextResponse.redirect(authUrl)
}
