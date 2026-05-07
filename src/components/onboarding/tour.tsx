"use client"

import { useState, useEffect, useCallback } from "react"

export type TourStep = {
  tourId: string
  title: string
  description: string
  nextLabel?: string
  position?: "top" | "bottom"
}

type SpotlightRect = {
  top: number
  left: number
  width: number
  height: number
}

type Props = {
  steps: TourStep[]
  currentStep: number
  onNext: () => void
  onSkip: () => void
  isActive: boolean
}

const BUBBLE_WIDTH = 320
const BUBBLE_GAP = 16
const BUBBLE_HEIGHT_ESTIMATE = 130

export function OnboardingTour({ steps, currentStep, onNext, onSkip, isActive }: Props) {
  const [spotlightRect, setSpotlightRect] = useState<SpotlightRect | null>(null)

  const step = steps[currentStep] as TourStep | undefined

  const updateRect = useCallback(() => {
    if (!step) return
    const el = document.querySelector(`[data-tour="${step.tourId}"]`)
    if (el) {
      const rect = el.getBoundingClientRect()
      setSpotlightRect({ top: rect.top, left: rect.left, width: rect.width, height: rect.height })
    } else {
      setSpotlightRect(null)
    }
  }, [step])

  useEffect(() => {
    if (!isActive || !step) return
    const el = document.querySelector(`[data-tour="${step.tourId}"]`)
    if (el) {
      const rect = el.getBoundingClientRect()
      setSpotlightRect({ top: rect.top, left: rect.left, width: rect.width, height: rect.height })
      el.scrollIntoView({ behavior: "smooth", block: "center" })
    } else {
      setSpotlightRect(null)
    }
  }, [currentStep, isActive, step])

  useEffect(() => {
    window.addEventListener("resize", updateRect, { passive: true })
    window.addEventListener("scroll", updateRect, { passive: true })
    return () => {
      window.removeEventListener("resize", updateRect)
      window.removeEventListener("scroll", updateRect)
    }
  }, [updateRect])

  if (!isActive) return null
  if (currentStep >= steps.length) return null
  if (!step) return null

  const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1200
  const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 800

  let bubbleTop = viewportHeight / 2 - BUBBLE_HEIGHT_ESTIMATE / 2
  let bubbleLeft = viewportWidth / 2 - BUBBLE_WIDTH / 2
  let showAbove = false

  if (spotlightRect) {
    const isAbove = step.position === "top" || spotlightRect.top > viewportHeight * 0.6
    showAbove = isAbove

    if (isAbove) {
      bubbleTop = spotlightRect.top - 8 - BUBBLE_GAP - BUBBLE_HEIGHT_ESTIMATE
      bubbleLeft = Math.min(Math.max(spotlightRect.left - 8, 16), viewportWidth - BUBBLE_WIDTH - 16)
    } else {
      bubbleTop = spotlightRect.top + spotlightRect.height + 16 + BUBBLE_GAP
      bubbleLeft = Math.min(Math.max(spotlightRect.left - 8, 16), viewportWidth - BUBBLE_WIDTH - 16)
    }
  }

  return (
    <>
      <style>{`
        @keyframes tour-bubble-in {
          from { opacity: 0; transform: translateY(6px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .tour-bubble-animate {
          animation: tour-bubble-in 0.25s ease-out forwards;
        }
      `}</style>

      {/* Spotlight overlay */}
      {spotlightRect && (
        <div
          style={{
            position: "fixed",
            top: spotlightRect.top - 8,
            left: spotlightRect.left - 8,
            width: spotlightRect.width + 16,
            height: spotlightRect.height + 16,
            borderRadius: 10,
            boxShadow: "0 0 0 9999px rgba(1,1,2,0.85)",
            border: "1px solid rgba(94,106,210,0.3)",
            zIndex: 50,
            pointerEvents: "none",
            transition: "all 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
      )}

      {/* Bubble */}
      <div
        key={currentStep}
        className="tour-bubble-animate"
        style={{
          position: "fixed",
          top: bubbleTop,
          left: bubbleLeft,
          width: BUBBLE_WIDTH,
          zIndex: 51,
          background: "#0f1011",
          border: "1px solid #23252a",
          borderRadius: 12,
          padding: 16,
          boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(94,106,210,0.1)",
        }}
      >
        {/* Upward caret — bubble sits below the spotlight */}
        {!showAbove && spotlightRect && (
          <div style={{ position: "absolute", top: -6, left: 20 }}>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 0,
                height: 0,
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderBottom: "6px solid #23252a",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 1,
                left: 1,
                width: 0,
                height: 0,
                borderLeft: "7px solid transparent",
                borderRight: "7px solid transparent",
                borderBottom: "6px solid #0f1011",
              }}
            />
          </div>
        )}

        {/* Downward caret — bubble sits above the spotlight */}
        {showAbove && spotlightRect && (
          <div
            style={{
              position: "absolute",
              bottom: -6,
              left: 20,
              width: 0,
              height: 0,
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderTop: "6px solid #0f1011",
            }}
          />
        )}

        {/* Step indicator */}
        <p className="text-[10px] text-[#62666d] uppercase tracking-wider mb-2">
          step {currentStep + 1} of {steps.length}
        </p>

        {/* Title */}
        <p className="text-sm font-semibold text-[#f7f8f8] mb-1.5">{step.title}</p>

        {/* Description */}
        <p className="text-xs text-[#8a8f98] leading-relaxed mb-4">{step.description}</p>

        {/* Button row */}
        <div className="flex items-center justify-between">
          <button
            className="text-xs text-[#62666d] hover:text-[#8a8f98] underline cursor-pointer"
            onClick={onSkip}
          >
            Skip tour
          </button>
          <button
            className="text-xs bg-[#5e6ad2] hover:bg-[#828fff] text-white rounded-lg px-3 py-1.5 font-medium transition-colors"
            onClick={onNext}
          >
            {step.nextLabel ?? "Next →"}
          </button>
        </div>
      </div>
    </>
  )
}
