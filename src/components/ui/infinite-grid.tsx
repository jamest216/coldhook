"use client"

import { useMotionValue, useMotionTemplate, useAnimationFrame, motion } from "framer-motion"
import { useEffect, useRef } from "react"

export function InfiniteGrid() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(-9999)
  const mouseY = useMotionValue(-9999)

  const gridOffsetX = useMotionValue(0)
  const gridOffsetY = useMotionValue(0)

  useEffect(() => {
    const parent = containerRef.current?.parentElement
    if (!parent) return

    const onMove = (e: MouseEvent) => {
      const { left, top } = parent.getBoundingClientRect()
      mouseX.set(e.clientX - left)
      mouseY.set(e.clientY - top)
    }
    const onLeave = () => {
      mouseX.set(-9999)
      mouseY.set(-9999)
    }

    parent.addEventListener("mousemove", onMove)
    parent.addEventListener("mouseleave", onLeave)
    return () => {
      parent.removeEventListener("mousemove", onMove)
      parent.removeEventListener("mouseleave", onLeave)
    }
  }, [mouseX, mouseY])

  // Use a large modulo (multiple of cell size) so the wrap is visually seamless
  // and happens very infrequently — eliminates the stutter from snapping at % 32.
  useAnimationFrame(() => {
    gridOffsetX.set((gridOffsetX.get() + 0.25) % 3200)
    gridOffsetY.set((gridOffsetY.get() + 0.25) % 3200)
  })

  const maskImage = useMotionTemplate`radial-gradient(160px circle at ${mouseX}px ${mouseY}px, black, transparent)`

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none">
      {/* Dim scrolling base layer */}
      <div className="absolute inset-0 opacity-[0.035]">
        <GridPattern id="infinite-grid-base" offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </div>
      {/* Bright cursor-reveal layer — unique pattern ID avoids SVG collision */}
      <motion.div
        className="absolute inset-0 opacity-50"
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <GridPattern id="infinite-grid-reveal" offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </motion.div>
    </div>
  )
}

function GridPattern({
  id,
  offsetX,
  offsetY,
}: {
  id: string
  offsetX: ReturnType<typeof useMotionValue<number>>
  offsetY: ReturnType<typeof useMotionValue<number>>
}) {
  return (
    <svg className="w-full h-full">
      <defs>
        <motion.pattern
          id={id}
          width={32}
          height={32}
          patternUnits="userSpaceOnUse"
          x={offsetX}
          y={offsetY}
        >
          <path
            d="M 32 0 L 0 0 0 32"
            fill="none"
            stroke="rgba(255,255,255,1)"
            strokeWidth="0.75"
          />
        </motion.pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}
