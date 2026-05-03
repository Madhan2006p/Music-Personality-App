"use client"

import type { GenreDNAEntry } from "@/lib/personality/types"
import { useEffect, useState } from "react"

interface GenreDNAChartProps {
  data: GenreDNAEntry[]
  size?: number
  className?: string
}

export function GenreDNAChart({ data, size = 280, className = "" }: GenreDNAChartProps) {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const centerX = size / 2
  const centerY = size / 2
  const radius = size / 2 - 20
  const innerRadius = radius * 0.55

  // Build SVG arcs
  let currentAngle = -90 // Start from top

  const segments = data.map((entry) => {
    const angle = (entry.percentage / 100) * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + angle
    currentAngle = endAngle

    const startRad = (startAngle * Math.PI) / 180
    const endRad = (endAngle * Math.PI) / 180

    const x1Outer = centerX + radius * Math.cos(startRad)
    const y1Outer = centerY + radius * Math.sin(startRad)
    const x2Outer = centerX + radius * Math.cos(endRad)
    const y2Outer = centerY + radius * Math.sin(endRad)

    const x1Inner = centerX + innerRadius * Math.cos(endRad)
    const y1Inner = centerY + innerRadius * Math.sin(endRad)
    const x2Inner = centerX + innerRadius * Math.cos(startRad)
    const y2Inner = centerY + innerRadius * Math.sin(startRad)

    const largeArc = angle > 180 ? 1 : 0

    const path = [
      `M ${x1Outer} ${y1Outer}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2Outer} ${y2Outer}`,
      `L ${x1Inner} ${y1Inner}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x2Inner} ${y2Inner}`,
      "Z",
    ].join(" ")

    return { ...entry, path, midAngle: (startAngle + endAngle) / 2 }
  })

  return (
    <div className={`flex flex-col md:flex-row items-center gap-8 ${className}`}>
      {/* Donut chart */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          viewBox={`0 0 ${size} ${size}`}
          width={size}
          height={size}
          className="drop-shadow-lg"
        >
          {segments.map((seg, i) => (
            <path
              key={seg.genre}
              d={seg.path}
              fill={seg.color}
              opacity={animated ? 0.85 : 0}
              className="transition-all duration-700 ease-out hover:opacity-100 cursor-pointer"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <title>{`${seg.genre}: ${seg.percentage}%`}</title>
            </path>
          ))}
          {/* Center text */}
          <text
            x={centerX}
            y={centerY - 8}
            textAnchor="middle"
            fill="white"
            fontSize="14"
            fontWeight="600"
            opacity="0.8"
          >
            Genre
          </text>
          <text
            x={centerX}
            y={centerY + 12}
            textAnchor="middle"
            fill="white"
            fontSize="12"
            fontWeight="400"
            opacity="0.5"
          >
            DNA
          </text>
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-2.5 min-w-[160px]">
        {data.map((entry, i) => (
          <div
            key={entry.genre}
            className="flex items-center gap-3 opacity-0 animate-slide-in"
            style={{ animationDelay: `${i * 80 + 300}ms`, animationFillMode: "forwards" }}
          >
            <div
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-foreground/80 flex-1">{entry.genre}</span>
            <span className="text-sm font-semibold text-foreground/60">{entry.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
