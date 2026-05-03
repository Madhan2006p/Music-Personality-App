"use client"

import { useRef, useCallback } from "react"
import type { PersonalityResult } from "@/lib/personality/types"
import { Button } from "@/components/ui/button"
import { Download, Copy, Check } from "lucide-react"
import { useState } from "react"

interface ShareCardCanvasProps {
  result: PersonalityResult
  className?: string
}

/** Draw the share card onto a canvas and return as blob */
async function renderShareCard(
  canvas: HTMLCanvasElement,
  result: PersonalityResult,
): Promise<void> {
  const ctx = canvas.getContext("2d")!
  const W = 1080
  const H = 1920
  canvas.width = W
  canvas.height = H

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, W, H)
  bgGrad.addColorStop(0, "#0a0a0f")
  bgGrad.addColorStop(0.5, "#111118")
  bgGrad.addColorStop(1, "#0a0a0f")
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, W, H)

  // Archetype color accent glow
  const glowGrad = ctx.createRadialGradient(W / 2, H * 0.3, 0, W / 2, H * 0.3, 400)
  glowGrad.addColorStop(0, `${result.archetype.color}25`)
  glowGrad.addColorStop(1, "transparent")
  ctx.fillStyle = glowGrad
  ctx.fillRect(0, 0, W, H)

  // Brand header
  ctx.fillStyle = "#ffffff50"
  ctx.font = "500 24px Inter, sans-serif"
  ctx.textAlign = "center"
  ctx.fillText("SONALYSIS", W / 2, 80)

  // Emoji
  ctx.font = "120px serif"
  ctx.textAlign = "center"
  ctx.fillText(result.archetype.emoji, W / 2, 300)

  // Archetype name
  ctx.fillStyle = result.archetype.color
  ctx.font = "bold 72px Inter, sans-serif"
  ctx.fillText(result.archetype.name, W / 2, 420)

  // Tagline
  ctx.fillStyle = "#ffffff80"
  ctx.font = "italic 32px Inter, sans-serif"
  ctx.fillText(`"${result.archetype.tagline}"`, W / 2, 480)

  // Divider line
  ctx.strokeStyle = `${result.archetype.color}40`
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(W * 0.2, 530)
  ctx.lineTo(W * 0.8, 530)
  ctx.stroke()

  // Alter Ego section
  ctx.fillStyle = "#ffffff40"
  ctx.font = "500 22px Inter, sans-serif"
  ctx.fillText("YOUR MUSIC ALTER EGO", W / 2, 600)

  ctx.fillStyle = result.archetype.color
  ctx.font = "bold 48px Inter, sans-serif"
  ctx.fillText(result.alterEgo.name, W / 2, 660)

  ctx.fillStyle = "#ffffff60"
  ctx.font = "400 26px Inter, sans-serif"
  ctx.fillText(result.alterEgo.title, W / 2, 710)

  // Genre DNA section
  ctx.fillStyle = "#ffffff40"
  ctx.font = "500 22px Inter, sans-serif"
  ctx.fillText("GENRE DNA", W / 2, 810)

  const topGenres = result.genreDNA.slice(0, 5)
  const barY = 850
  const barWidth = W * 0.6
  const barStartX = (W - barWidth) / 2

  topGenres.forEach((genre, i) => {
    const y = barY + i * 55
    const w = (genre.percentage / 100) * barWidth

    // Bar background
    ctx.fillStyle = "#ffffff08"
    ctx.beginPath()
    ctx.roundRect(barStartX, y, barWidth, 30, 15)
    ctx.fill()

    // Bar fill
    ctx.fillStyle = genre.color
    ctx.globalAlpha = 0.8
    ctx.beginPath()
    ctx.roundRect(barStartX, y, Math.max(w, 30), 30, 15)
    ctx.fill()
    ctx.globalAlpha = 1

    // Label
    ctx.fillStyle = "#ffffffcc"
    ctx.font = "500 18px Inter, sans-serif"
    ctx.textAlign = "left"
    ctx.fillText(`${genre.genre} ${genre.percentage}%`, barStartX + 12, y + 21)
    ctx.textAlign = "center"
  })

  // Mood section
  const moodY = barY + topGenres.length * 55 + 60
  ctx.fillStyle = "#ffffff40"
  ctx.font = "500 22px Inter, sans-serif"
  ctx.textAlign = "center"
  ctx.fillText("MOOD SPECTRUM", W / 2, moodY)

  const moods = [
    { label: "Energy", value: result.moodSpectrum.energy, color: "#FF6B35" },
    { label: "Happiness", value: result.moodSpectrum.happiness, color: "#FFE66D" },
    { label: "Danceability", value: result.moodSpectrum.danceability, color: "#1DB954" },
    { label: "Intensity", value: result.moodSpectrum.intensity, color: "#FF4757" },
  ]

  moods.forEach((mood, i) => {
    const y = moodY + 30 + i * 50
    ctx.fillStyle = "#ffffff60"
    ctx.font = "400 18px Inter, sans-serif"
    ctx.textAlign = "left"
    ctx.fillText(mood.label, barStartX, y + 18)

    ctx.textAlign = "right"
    ctx.fillStyle = mood.color
    ctx.font = "600 18px Inter, sans-serif"
    ctx.fillText(`${mood.value}%`, barStartX + barWidth, y + 18)

    // Mini bar
    const miniBarX = barStartX + 130
    const miniBarW = barWidth - 190
    ctx.fillStyle = "#ffffff08"
    ctx.beginPath()
    ctx.roundRect(miniBarX, y + 5, miniBarW, 12, 6)
    ctx.fill()

    ctx.fillStyle = mood.color
    ctx.globalAlpha = 0.7
    ctx.beginPath()
    ctx.roundRect(miniBarX, y + 5, (mood.value / 100) * miniBarW, 12, 6)
    ctx.fill()
    ctx.globalAlpha = 1

    ctx.textAlign = "center"
  })

  // Traits
  const traitsY = moodY + 30 + moods.length * 50 + 50
  ctx.fillStyle = "#ffffff40"
  ctx.font = "500 22px Inter, sans-serif"
  ctx.fillText("PERSONALITY TRAITS", W / 2, traitsY)

  const traits = result.alterEgo.traits
  const traitWidth = 180
  const totalTraitsWidth = traits.length * traitWidth + (traits.length - 1) * 12
  let traitX = (W - totalTraitsWidth) / 2

  traits.forEach((trait) => {
    ctx.fillStyle = `${result.archetype.color}20`
    ctx.beginPath()
    ctx.roundRect(traitX, traitsY + 20, traitWidth, 40, 20)
    ctx.fill()

    ctx.strokeStyle = `${result.archetype.color}40`
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.roundRect(traitX, traitsY + 20, traitWidth, 40, 20)
    ctx.stroke()

    ctx.fillStyle = result.archetype.color
    ctx.font = "500 16px Inter, sans-serif"
    ctx.fillText(trait, traitX + traitWidth / 2, traitsY + 46)

    traitX += traitWidth + 12
  })

  // Footer
  ctx.fillStyle = "#ffffff30"
  ctx.font = "400 20px Inter, sans-serif"
  ctx.textAlign = "center"
  ctx.fillText("sonalysis.app — Discover Your Music DNA", W / 2, H - 60)

  // Spotify attribution
  ctx.fillStyle = "#1DB95480"
  ctx.font = "400 16px Inter, sans-serif"
  ctx.fillText("Powered by Spotify", W / 2, H - 30)
}

export function ShareCardCanvas({ result, className = "" }: ShareCardCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [copied, setCopied] = useState(false)
  const [rendered, setRendered] = useState(false)

  const handleRender = useCallback(async () => {
    if (!canvasRef.current) return
    await renderShareCard(canvasRef.current, result)
    setRendered(true)
  }, [result])

  // Auto-render on mount
  const canvasCallbackRef = useCallback(
    (node: HTMLCanvasElement | null) => {
      if (node) {
        (canvasRef as React.MutableRefObject<HTMLCanvasElement>).current = node
        renderShareCard(node, result).then(() => setRendered(true))
      }
    },
    [result],
  )

  const handleDownload = useCallback(() => {
    if (!canvasRef.current) return
    const link = document.createElement("a")
    link.download = `sonalysis-${result.archetype.id}.png`
    link.href = canvasRef.current.toDataURL("image/png")
    link.click()
  }, [result.archetype.id])

  const handleCopy = useCallback(async () => {
    if (!canvasRef.current) return
    try {
      const blob = await new Promise<Blob>((resolve) => {
        canvasRef.current!.toBlob((b) => resolve(b!), "image/png")
      })
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback: download instead
      handleDownload()
    }
  }, [handleDownload])

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Canvas preview */}
      <div className="relative rounded-2xl overflow-hidden border border-white/5 max-w-sm mx-auto">
        <canvas
          ref={canvasCallbackRef}
          className="w-full h-auto"
          style={{ aspectRatio: "9/16" }}
        />
        {!rendered && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <span className="text-muted-foreground">Rendering...</span>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 justify-center">
        <Button
          id="download-share-card"
          onClick={handleDownload}
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
        >
          <Download className="w-4 h-4" />
          Download
        </Button>
        <Button
          id="copy-share-card"
          onClick={handleCopy}
          variant="outline"
          className="gap-2"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied!" : "Copy Image"}
        </Button>
      </div>
    </div>
  )
}
