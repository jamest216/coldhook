"use client"

import { useState, useEffect, useCallback, useRef } from "react"

export type TourStep = {
  tourId: string
  title: string
  description: string
  nextLabel?: string
  position?: "top" | "bottom"
  disableNext?: boolean
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
  onLockScroll?: () => void
  onUnlockScroll?: () => void
  onStepChange?: (stepIndex: number) => void
}

const BUBBLE_WIDTH = 320
const BUBBLE_GAP = 16
const BUBBLE_HEIGHT_ESTIMATE = 160

// Module-level vars — avoid re-renders during scroll/lock sequencing
let _elevatedEl: HTMLElement | null = null
let _elevatedPrevZ = ""
let _elevatedPrevPos = ""
let _mainEl: HTMLElement | null = null

function restoreElevation() {
  if (_elevatedEl) {
    _elevatedEl.style.zIndex = _elevatedPrevZ
    _elevatedEl.style.position = _elevatedPrevPos
    _elevatedPrevZ = ""
    _elevatedPrevPos = ""
    _elevatedEl = null
  }
}

function findScrollParent(el: Element): HTMLElement | null {
  let node: Element | null = el.parentElement
  while (node && node !== document.documentElement) {
    const { overflowY } = window.getComputedStyle(node)
    if (overflowY === "auto" || overflowY === "scroll") return node as HTMLElement
    node = node.parentElement
  }
  return null
}

export function OnboardingTour({
  steps,
  currentStep,
  onNext,
  onSkip,
  isActive,
  onLockScroll,
  onUnlockScroll,
  onStepChange,
}: Props) {
  const [spotlightRect, setSpotlightRect] = useState<SpotlightRect | null>(null)
  const scrollListenerRef = useRef<{ el: HTMLElement; handler: () => void } | null>(null)

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

  // Step-change effect: scroll into view, elevate target, lock scroll
  useEffect(() => {
    if (!isActive || !step) return

    restoreElevation()

    // Remove any existing panel scroll listener before re-attaching
    if (scrollListenerRef.current) {
      scrollListenerRef.current.el.removeEventListener("scroll", scrollListenerRef.current.handler)
      scrollListenerRef.current = null
    }

    onStepChange?.(currentStep)

    // Unlock scroll before scrollIntoView
    onUnlockScroll?.()
    _mainEl = document.querySelector("main") as HTMLElement | null
    if (_mainEl) _mainEl.style.overflowY = "auto"

    let attempts = 0
    const MAX_ATTEMPTS = 8
    const RETRY_MS = 150

    const tryFind = () => {
      const el = document.querySelector(`[data-tour="${step.tourId}"]`) as HTMLElement | null
      if (el) {
        // Elevate element above the backdrop immediately so it's visible
        _elevatedPrevZ = el.style.zIndex
        _elevatedPrevPos = el.style.position
        el.style.position = "relative"
        el.style.zIndex = "101"
        _elevatedEl = el

        // Scroll into view with center block so the full card + bubble both fit
        el.scrollIntoView({ behavior: "smooth", block: "center" })

        // Wait for the smooth scroll animation to settle before measuring rect
        // and re-locking scroll. Measuring too early gives wrong coordinates.
        setTimeout(() => {
          if (attempts >= MAX_ATTEMPTS) return // step changed, abort
          const r = el.getBoundingClientRect()
          setSpotlightRect({ top: r.top, left: r.left, width: r.width, height: r.height })
          onLockScroll?.()
          if (_mainEl) _mainEl.style.overflowY = "hidden"
        }, 450)
      } else if (attempts < MAX_ATTEMPTS) {
        attempts++
        setTimeout(tryFind, RETRY_MS)
      } else {
        setSpotlightRect(null)
      }
    }

    tryFind()

    return () => { attempts = MAX_ATTEMPTS }
  }, [currentStep, isActive, step])

  // Scroll + resize listeners — listen on the panel container, not just window
  useEffect(() => {
    if (!isActive || !step) return
    const el = document.querySelector(`[data-tour="${step.tourId}"]`)
    const scrollParent = el ? findScrollParent(el) : null

    window.addEventListener("resize", updateRect, { passive: true })

    if (scrollParent) {
      scrollParent.addEventListener("scroll", updateRect, { passive: true })
      scrollListenerRef.current = { el: scrollParent, handler: updateRect }
    }

    return () => {
      window.removeEventListener("resize", updateRect)
      if (scrollListenerRef.current) {
        scrollListenerRef.current.el.removeEventListener("scroll", scrollListenerRef.current.handler)
        scrollListenerRef.current = null
      }
    }
  }, [updateRect, isActive, step])

  // Cleanup when tour deactivates (skip or complete)
  useEffect(() => {
    if (isActive) return
    restoreElevation()
    onUnlockScroll?.()
    if (_mainEl) {
      _mainEl.style.overflowY = ""
      _mainEl = null
    }
    if (scrollListenerRef.current) {
      scrollListenerRef.current.el.removeEventListener("scroll", scrollListenerRef.current.handler)
      scrollListenerRef.current = null
    }
  }, [isActive])

  // ESC key to skip
  useEffect(() => {
    if (!isActive) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onSkip()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [isActive, onSkip])

  if (!isActive) return null
  if (currentStep >= steps.length) return null
  if (!step) return null

  const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1200
  const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 800

  let bubbleTop: number
  let bubbleLeft: number
  let showAbove = false

  if (spotlightRect) {
    const spotlightBottom = spotlightRect.top + spotlightRect.height + 16
    const wouldOverflowBottom = (spotlightBottom + BUBBLE_GAP + BUBBLE_HEIGHT_ESTIMATE) > (viewportHeight - 20)
    const forceAbove = step.position === "top" || spotlightRect.top > viewportHeight * 0.6 || wouldOverflowBottom

    showAbove = forceAbove

    if (forceAbove) {
      bubbleTop = spotlightRect.top - 8 - BUBBLE_GAP - BUBBLE_HEIGHT_ESTIMATE
    } else {
      bubbleTop = spotlightRect.top + spotlightRect.height + 16 + BUBBLE_GAP
    }

    const rawLeft = spotlightRect.left - 8
    bubbleLeft = Math.max(16, Math.min(rawLeft, viewportWidth - BUBBLE_WIDTH - 16))
  } else {
    bubbleTop = viewportHeight / 2 - BUBBLE_HEIGHT_ESTIMATE / 2
    bubbleLeft = viewportWidth / 2 - BUBBLE_WIDTH / 2
  }

  // Final clamp — bubble must always be fully on screen
  bubbleTop = Math.max(12, Math.min(bubbleTop, viewportHeight - BUBBLE_HEIGHT_ESTIMATE - 12))
  bubbleLeft = Math.max(12, Math.min(bubbleLeft, viewportWidth - BUBBLE_WIDTH - 12))

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

      {/* Full-screen backdrop — blocks all clicks outside the spotlight */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 100,
          background: "rgba(1,1,2,0.72)",
          pointerEvents: "all",
        }}
      />

      {/* Spotlight border frame — purely visual, no pointer events */}
      {spotlightRect && (
        <div
          style={{
            position: "fixed",
            top: spotlightRect.top - 8,
            left: spotlightRect.left - 8,
            width: spotlightRect.width + 16,
            height: spotlightRect.height + 16,
            borderRadius: 10,
            border: "1.5px solid rgba(94,106,210,0.6)",
            zIndex: 101,
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
          zIndex: 102,
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
            className="text-xs bg-[#5e6ad2] text-white rounded-lg px-3 py-1.5 font-medium transition-colors"
            style={{
              opacity: step.disableNext ? 0.4 : 1,
              cursor: step.disableNext ? "not-allowed" : "pointer",
            }}
            onClick={step.disableNext ? undefined : onNext}
          >
            {step.nextLabel ?? "Next →"}
          </button>
        </div>
      </div>
    </>
  )
}
