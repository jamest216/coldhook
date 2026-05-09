"use client"

import { useAnimationFrame } from "framer-motion"
import { useEffect, useRef } from "react"

const CELL = 32       // grid cell size in px
const SPEED = 0.25    // px per frame

// CSS background-image that draws grid lines at the edges of each cell
const GRID_BG = [
  "linear-gradient(rgba(255,255,255,1) 0.75px, transparent 0.75px)",
  "linear-gradient(90deg, rgba(255,255,255,1) 0.75px, transparent 0.75px)",
].join(", ")

export function InfiniteGrid() {
  const baseRef   = useRef<HTMLDivElement>(null)
  const revealRef = useRef<HTMLDivElement>(null)

  // Plain refs — no MotionValues, no React state, no re-renders
  const ox = useRef(0)
  const oy = useRef(0)
  const mx = useRef(-9999)
  const my = useRef(-9999)

  useEffect(() => {
    const parent = baseRef.current?.parentElement
    if (!parent) return

    const onMove = (e: MouseEvent) => {
      const r = parent.getBoundingClientRect()
      mx.current = e.clientX - r.left
      my.current = e.clientY - r.top
    }
    const onLeave = () => {
      mx.current = -9999
      my.current = -9999
    }

    parent.addEventListener("mousemove", onMove)
    parent.addEventListener("mouseleave", onLeave)
    return () => {
      parent.removeEventListener("mousemove", onMove)
      parent.removeEventListener("mouseleave", onLeave)
    }
  }, [])

  useAnimationFrame(() => {
    // Advance offset — modulo CELL (32) is seamless for a tiling grid
    ox.current = (ox.current + SPEED) % CELL
    oy.current = (oy.current + SPEED) % CELL

    const bgPos = `${ox.current}px ${oy.current}px`
    const mask  = `radial-gradient(160px circle at ${mx.current}px ${my.current}px, black, transparent)`

    // Single synchronous batch — base + reveal + mask in one callback, one paint frame
    if (baseRef.current) {
      baseRef.current.style.backgroundPosition = bgPos
    }
    if (revealRef.current) {
      revealRef.current.style.backgroundPosition   = bgPos
      revealRef.current.style.maskImage            = mask
      revealRef.current.style.webkitMaskImage      = mask
    }
  })

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      {/* Dim scrolling base layer */}
      <div
        ref={baseRef}
        className="absolute inset-0"
        style={{
          backgroundImage: GRID_BG,
          backgroundSize: `${CELL}px ${CELL}px`,
          opacity: 0.035,
        }}
      />
      {/* Bright cursor-reveal layer */}
      <div
        ref={revealRef}
        className="absolute inset-0"
        style={{
          backgroundImage: GRID_BG,
          backgroundSize: `${CELL}px ${CELL}px`,
          opacity: 0.5,
          maskImage: `radial-gradient(160px circle at -9999px -9999px, black, transparent)`,
          WebkitMaskImage: `radial-gradient(160px circle at -9999px -9999px, black, transparent)`,
        }}
      />
    </div>
  )
}
