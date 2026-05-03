"use client"

import { Navigation } from "@/components/navigation"
import { SpotifyConnectButton } from "@/components/spotify-connect-button"
import { MusicVisualizer } from "@/components/music-visualizer"
import { ARCHETYPES } from "@/lib/personality/engine"
import { Music, Dna, Share2, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        <MusicVisualizer />

        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 animate-fade-in-up">
              <Sparkles className="w-4 h-4" />
              Spotify-Powered Personality Analyzer
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-balance leading-tight animate-fade-in-up stagger-1" style={{ animationFillMode: "forwards" }}>
              Discover Your{" "}
              <span className="bg-gradient-to-r from-[#1DB954] via-[#1ED760] to-[#4ECDC4] bg-clip-text text-transparent">
                Music DNA
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto opacity-0 animate-fade-in-up stagger-2" style={{ animationFillMode: "forwards" }}>
              Connect your Spotify and unlock a deep personality analysis based on your listening habits. 
              Get your archetype, mood spectrum, alter ego, and a shareable personality card.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 opacity-0 animate-fade-in-up stagger-3" style={{ animationFillMode: "forwards" }}>
              <SpotifyConnectButton />
              <Link href="/results?demo=true">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-lg rounded-full border-white/10 hover:bg-white/5"
                >
                  Try Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-6 py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">How It Works</h2>
        <p className="text-center text-muted-foreground mb-16 text-lg max-w-2xl mx-auto">
          Three steps to discover what your music taste reveals about you
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { icon: Music, step: "01", title: "Connect Spotify", desc: "Securely link your Spotify account. We only read your listening history — nothing else." },
            { icon: Dna, step: "02", title: "AI Analysis", desc: "Our algorithm analyzes your top tracks, genres, and audio features to build your unique profile." },
            { icon: Share2, step: "03", title: "Share Your DNA", desc: "Get a beautifully designed personality card. Download it or share the link with friends." },
          ].map((item, i) => (
            <div
              key={item.step}
              className="relative p-6 rounded-2xl glass text-center group hover:border-primary/20 transition-all"
            >
              <div className="text-xs font-bold text-primary/40 mb-4">{item.step}</div>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <item.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Archetypes Preview */}
      <section className="container mx-auto px-6 py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">10 Listening Archetypes</h2>
        <p className="text-center text-muted-foreground mb-16 text-lg max-w-2xl mx-auto">
          Which one are you? Connect Spotify to find out.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
          {ARCHETYPES.map((archetype) => (
            <div
              key={archetype.id}
              className="p-4 rounded-xl text-center group cursor-default hover:scale-105 transition-transform"
              style={{
                background: `linear-gradient(135deg, ${archetype.gradientFrom}10, ${archetype.gradientTo}05)`,
                border: `1px solid ${archetype.color}15`,
              }}
            >
              <div className="text-3xl mb-2">{archetype.emoji}</div>
              <div className="text-sm font-semibold" style={{ color: archetype.color }}>
                {archetype.name}
              </div>
              <div className="text-xs text-muted-foreground mt-1 hidden md:block">
                {archetype.tagline}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 py-24">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to discover your music personality?</h2>
          <p className="text-lg text-muted-foreground">
            It takes less than 30 seconds. Your data stays private.
          </p>
          <SpotifyConnectButton />
        </div>
      </section>
    </div>
  )
}
