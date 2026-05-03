"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSpotify } from "@/contexts/spotify-context"
import { useAuth } from "@/contexts/auth-context"
import { WaveBars } from "@/components/music-visualizer"
import { generateDemoResult } from "@/lib/personality/engine"

const STEPS = [
  "Connecting to Spotify...",
  "Reading your library...",
  "Analyzing audio patterns...",
  "Classifying your archetype...",
  "Building your profile...",
]

function AnalyzeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { analyzePersonality, setResult, error } = useSpotify()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    // Advance steps for visual feedback
    const interval = setInterval(() => {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1))
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const run = async () => {
      try {
        // Check if there's a token from anonymous OAuth flow
        const spotifyToken = searchParams.get("spotify_token")

        if (spotifyToken) {
          await analyzePersonality(spotifyToken)
        } else if (user) {
          // Authenticated user with stored tokens
          await analyzePersonality()
        } else {
          // No token and not logged in — use demo
          const demoResult = generateDemoResult()
          setResult(demoResult)
        }

        // Navigate to results
        router.push("/results")
      } catch {
        setFailed(true)
      }
    }

    // Small delay for animation
    const timer = setTimeout(run, 1000)
    return () => clearTimeout(timer)
  }, [analyzePersonality, router, searchParams, setResult, user])

  if (failed || error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="text-6xl">😢</div>
          <h1 className="text-2xl font-bold">Analysis Failed</h1>
          <p className="text-muted-foreground">{error || "Something went wrong. Please try again."}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Go Home
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-full border border-white/10 font-medium hover:bg-white/5 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[150px] animate-float" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-[120px] animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10 text-center space-y-12 px-4">
        {/* Spinning DNA icon */}
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-[spin-slow_3s_linear_infinite]" />
          <div className="absolute inset-2 rounded-full border-2 border-primary/40 animate-[spin-slow_2s_linear_infinite_reverse]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <WaveBars count={5} />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {STEPS.map((step, i) => (
            <div
              key={step}
              className={`text-sm transition-all duration-500 ${
                i === currentStep
                  ? "text-primary font-medium scale-105"
                  : i < currentStep
                    ? "text-muted-foreground/50"
                    : "text-muted-foreground/20"
              }`}
            >
              {i < currentStep ? "✓ " : i === currentStep ? "● " : "○ "}
              {step}
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground/40">This usually takes about 10 seconds</p>
      </div>
    </div>
  )
}

export default function AnalyzePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <WaveBars count={5} />
      </div>
    }>
      <AnalyzeContent />
    </Suspense>
  )
}
