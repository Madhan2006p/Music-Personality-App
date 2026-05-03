"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"
import type { PersonalityResult } from "@/lib/personality/types"

type SpotifyContextType = {
  isConnected: boolean
  isAnalyzing: boolean
  personalityResult: PersonalityResult | null
  resultId: string | null
  error: string | null
  connectSpotify: () => void
  analyzePersonality: (accessToken?: string) => Promise<void>
  setResult: (result: PersonalityResult, id?: string) => void
  clearResult: () => void
}

const SpotifyContext = createContext<SpotifyContextType>({
  isConnected: false,
  isAnalyzing: false,
  personalityResult: null,
  resultId: null,
  error: null,
  connectSpotify: () => {},
  analyzePersonality: async () => {},
  setResult: () => {},
  clearResult: () => {},
})

export function SpotifyProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [personalityResult, setPersonalityResult] = useState<PersonalityResult | null>(null)
  const [resultId, setResultId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const connectSpotify = useCallback(() => {
    window.location.href = "/api/spotify/login"
  }, [])

  const analyzePersonality = useCallback(async (accessToken?: string) => {
    setIsAnalyzing(true)
    setError(null)

    try {
      const response = await fetch("/api/spotify/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(accessToken ? { accessToken } : {}),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Analysis failed")
      }

      const data = await response.json()
      setPersonalityResult(data)
      setResultId(data.resultId || null)
      setIsConnected(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed")
      throw err
    } finally {
      setIsAnalyzing(false)
    }
  }, [])

  const setResult = useCallback((result: PersonalityResult, id?: string) => {
    setPersonalityResult(result)
    setResultId(id || null)
    setIsConnected(true)
  }, [])

  const clearResult = useCallback(() => {
    setPersonalityResult(null)
    setResultId(null)
    setError(null)
  }, [])

  return (
    <SpotifyContext.Provider
      value={{
        isConnected,
        isAnalyzing,
        personalityResult,
        resultId,
        error,
        connectSpotify,
        analyzePersonality,
        setResult,
        clearResult,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  )
}

export function useSpotify() {
  const context = useContext(SpotifyContext)
  if (!context) {
    throw new Error("useSpotify must be used within a SpotifyProvider")
  }
  return context
}
