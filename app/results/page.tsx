"use client"

import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { ArchetypeCard } from "@/components/archetype-card"
import { GenreDNAChart } from "@/components/genre-dna-chart"
import { MoodSpectrumChart } from "@/components/mood-spectrum"
import { AlterEgoCard } from "@/components/alter-ego-card"
import { TopArtistsGrid, TopTracksGrid } from "@/components/top-items-grid"
import { ShareCardCanvas } from "@/components/share-card-canvas"
import { useSpotify } from "@/contexts/spotify-context"
import { generateDemoResult } from "@/lib/personality/engine"
import { Button } from "@/components/ui/button"
import { Share2, RotateCcw } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

function ResultsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { personalityResult, setResult } = useSpotify()
  const [showShareCard, setShowShareCard] = useState(false)
  const isDemo = searchParams.get("demo") === "true"

  // Load demo result if needed
  useEffect(() => {
    if (!personalityResult && isDemo) {
      setResult(generateDemoResult())
    } else if (!personalityResult && !isDemo) {
      router.push("/")
    }
  }, [personalityResult, isDemo, setResult, router])

  const result = personalityResult
  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading results...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-4xl space-y-12">
        {/* Demo banner */}
        {isDemo && (
          <div className="text-center p-4 rounded-xl bg-primary/10 border border-primary/20">
            <p className="text-sm text-primary">
              🎵 This is a demo result. <Link href="/" className="underline font-semibold">Connect Spotify</Link> for your real personality!
            </p>
          </div>
        )}

        {/* Header with user info */}
        <div className="text-center space-y-2 animate-fade-in-up">
          <p className="text-sm text-muted-foreground uppercase tracking-widest">Your Music Personality</p>
          {result.spotifyDisplayName && (
            <p className="text-lg text-foreground/60">{result.spotifyDisplayName}</p>
          )}
        </div>

        {/* Archetype Card */}
        <section>
          <ArchetypeCard archetype={result.archetype} score={result.archetypeScore} />
        </section>

        {/* Alter Ego */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-muted-foreground">
            Your Music Alter Ego
          </h2>
          <AlterEgoCard alterEgo={result.alterEgo} archetypeColor={result.archetype.color} />
        </section>

        {/* Genre DNA */}
        <section>
          <h2 className="text-xl font-semibold mb-6 text-muted-foreground">
            Genre DNA
          </h2>
          <div className="p-6 rounded-2xl glass">
            <GenreDNAChart data={result.genreDNA} />
          </div>
        </section>

        {/* Mood Spectrum */}
        <section>
          <h2 className="text-xl font-semibold mb-6 text-muted-foreground">
            Mood Spectrum
          </h2>
          <div className="p-6 rounded-2xl glass">
            <MoodSpectrumChart data={result.moodSpectrum} />
          </div>
        </section>

        {/* Top Artists */}
        {result.topArtists.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-6 text-muted-foreground">
              Top Artists
            </h2>
            <div className="p-6 rounded-2xl glass">
              <TopArtistsGrid artists={result.topArtists} />
            </div>
          </section>
        )}

        {/* Top Tracks */}
        {result.topTracks.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-6 text-muted-foreground">
              Top Tracks
            </h2>
            <div className="p-6 rounded-2xl glass">
              <TopTracksGrid tracks={result.topTracks} />
            </div>
          </section>
        )}

        {/* Share Section */}
        <section className="text-center space-y-6 pt-8 border-t border-white/5">
          <h2 className="text-2xl font-bold">Share Your Results</h2>
          <p className="text-muted-foreground">Download your personality card or copy the link</p>

          {!showShareCard ? (
            <Button
              id="show-share-card-btn"
              onClick={() => setShowShareCard(true)}
              size="lg"
              className="rounded-full px-8 gap-2"
            >
              <Share2 className="w-5 h-5" />
              Generate Share Card
            </Button>
          ) : (
            <ShareCardCanvas result={result} />
          )}
        </section>

        {/* Actions */}
        <div className="flex justify-center gap-4 pb-12">
          <Link href="/">
            <Button variant="outline" className="rounded-full gap-2">
              <RotateCcw className="w-4 h-4" />
              Analyze Again
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading results...</div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  )
}
