"use client"

import { useEffect, Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { ArchetypeCard } from "@/components/archetype-card"
import { GenreDNAChart } from "@/components/genre-dna-chart"
import { MoodSpectrumChart } from "@/components/mood-spectrum"
import { AlterEgoCard } from "@/components/alter-ego-card"
import { TopArtistsGrid, TopTracksGrid } from "@/components/top-items-grid"
import { ShareCardCanvas } from "@/components/share-card-canvas"
import { AudioFeaturesBreakdown, PersonalityInsights } from "@/components/personality-insights"
import { useSpotify } from "@/contexts/spotify-context"
import { generateDemoResult, ARCHETYPES } from "@/lib/personality/engine"
import { Button } from "@/components/ui/button"
import { Share2, RotateCcw, ChevronDown, Dna, Brain, BarChart3, Users, Music, Sparkles, Download } from "lucide-react"
import Link from "next/link"

/** Section wrapper with icon, title, subtitle, and number */
function Section({
  icon: Icon,
  number,
  title,
  subtitle,
  children,
  className = "",
}: {
  icon: React.ComponentType<{ className?: string }>
  number: string
  title: string
  subtitle: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={`opacity-0 animate-fade-in-up ${className}`} style={{ animationFillMode: "forwards" }}>
      <div className="flex items-start gap-4 mb-6">
        <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-foreground/40" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-bold text-primary/50 uppercase tracking-widest">{number}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">{title}</h2>
          <p className="text-sm text-foreground/35 mt-0.5">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  )
}

function ResultsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { personalityResult, setResult } = useSpotify()
  const [showShareCard, setShowShareCard] = useState(false)
  const isDemo = searchParams.get("demo") === "true"

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
        <div className="text-muted-foreground animate-pulse">Assembling your profile...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-[0.06] blur-[150px]"
          style={{ background: `radial-gradient(ellipse, ${result.archetype.color}, transparent 70%)` }}
        />
      </div>

      <main className="relative z-10 container mx-auto px-4 md:px-6 py-8 md:py-16 max-w-4xl">
        {/* Demo banner */}
        {isDemo && (
          <div className="text-center p-4 rounded-2xl bg-primary/8 border border-primary/15 mb-8 animate-fade-in-up">
            <p className="text-sm text-primary/80">
              🎵 Viewing demo data. <Link href="/" className="underline font-semibold text-primary hover:text-primary/90">Connect your Spotify</Link> to discover your real music personality!
            </p>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up" style={{ animationFillMode: "forwards" }}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/25 mb-3">
            Your Music Personality Profile
          </p>
          {result.spotifyDisplayName && (
            <p className="text-lg text-foreground/40 font-light">{result.spotifyDisplayName}</p>
          )}
          <div className="flex justify-center mt-4">
            <ChevronDown className="w-5 h-5 text-foreground/15 animate-bounce" />
          </div>
        </div>

        <div className="space-y-16">
          {/* 01: Archetype */}
          <Section
            icon={Brain}
            number="01"
            title="Your Listening Archetype"
            subtitle="Based on your top tracks, genres, and audio features"
          >
            <ArchetypeCard
              archetype={result.archetype}
              score={result.archetypeScore}
              allScores={result.allScores}
            />
          </Section>

          {/* 02: Alter Ego */}
          <Section
            icon={Sparkles}
            number="02"
            title="Your Music Alter Ego"
            subtitle="A persona born from your unique listening DNA"
            className="stagger-1"
          >
            <AlterEgoCard
              alterEgo={result.alterEgo}
              archetypeColor={result.archetype.color}
            />
          </Section>

          {/* 03: Genre DNA */}
          <Section
            icon={Dna}
            number="03"
            title="Genre DNA"
            subtitle="Your musical genome — what genres flow through your veins"
            className="stagger-2"
          >
            <div className="p-6 md:p-8 rounded-3xl glass">
              <GenreDNAChart data={result.genreDNA} />
            </div>
          </Section>

          {/* 04: Mood Spectrum */}
          <Section
            icon={BarChart3}
            number="04"
            title="Mood Spectrum"
            subtitle="How your music tastes map across 6 emotional dimensions"
            className="stagger-3"
          >
            <div className="p-4 md:p-6 rounded-3xl glass">
              <MoodSpectrumChart data={result.moodSpectrum} />
            </div>
          </Section>

          {/* 05: Audio Features */}
          <Section
            icon={Music}
            number="05"
            title="Audio Fingerprint"
            subtitle="The raw audio characteristics that define your taste"
            className="stagger-4"
          >
            <AudioFeaturesBreakdown
              features={result.audioFeaturesAvg}
              archetypeColor={result.archetype.color}
            />
          </Section>

          {/* 06: Personality Insights */}
          <Section
            icon={Sparkles}
            number="06"
            title="Personality Insights"
            subtitle="What your listening data reveals about you"
            className="stagger-5"
          >
            <PersonalityInsights result={result} />
          </Section>

          {/* 07: Top Artists */}
          {result.topArtists.length > 0 && (
            <Section
              icon={Users}
              number="07"
              title="Top Artists"
              subtitle="The artists who shaped your musical identity"
              className="stagger-6"
            >
              <div className="p-6 md:p-8 rounded-3xl glass">
                <TopArtistsGrid artists={result.topArtists} />
              </div>
            </Section>
          )}

          {/* 08: Top Tracks */}
          {result.topTracks.length > 0 && (
            <Section
              icon={Music}
              number="08"
              title="Top Tracks"
              subtitle="Your most-played songs from recent months"
            >
              <div className="p-4 md:p-6 rounded-3xl glass">
                <TopTracksGrid tracks={result.topTracks} />
              </div>
            </Section>
          )}

          {/* Share Section */}
          <section className="pt-8 border-t border-white/[0.04]">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 text-primary/70 text-xs font-semibold uppercase tracking-widest border border-primary/15">
                <Share2 className="w-3.5 h-3.5" />
                Share
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">Share Your Music DNA</h2>
              <p className="text-foreground/40 max-w-md mx-auto">
                Download a beautifully designed personality card — perfect for Instagram Stories, Twitter, or texting to friends.
              </p>

              {!showShareCard ? (
                <Button
                  id="show-share-card-btn"
                  onClick={() => setShowShareCard(true)}
                  size="lg"
                  className="rounded-full px-10 py-6 text-lg gap-2.5 bg-primary hover:bg-primary/90"
                >
                  <Download className="w-5 h-5" />
                  Generate Share Card
                </Button>
              ) : (
                <ShareCardCanvas result={result} />
              )}
            </div>
          </section>

          {/* Footer actions */}
          <div className="flex justify-center gap-4 pb-12">
            <Link href="/">
              <Button variant="outline" className="rounded-full gap-2 border-white/10 hover:bg-white/5">
                <RotateCcw className="w-4 h-4" />
                Analyze Again
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-muted-foreground animate-pulse">Loading results...</div>
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  )
}
