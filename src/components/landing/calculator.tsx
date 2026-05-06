"use client"

import { useState, useEffect, useRef } from "react"
import { TrendingUp } from "lucide-react"
import Link from "next/link"

const COLDHOOK_REPLY_RATE = 0.34
const CLOSE_RATE = 0.2
const MEETING_RATE = 0.2
const WEEKS_PER_MONTH = 4.33
const MINUTES_SAVED_PER_EMAIL = 18

function formatCurrency(value: number): string {
  return "$" + Math.round(value).toLocaleString("en-US")
}

function animateValue(
  start: number,
  end: number,
  duration: number,
  onFrame: (value: number) => void
) {
  const startTime = performance.now()
  function tick(now: number) {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    onFrame(start + (end - start) * eased)
    if (progress < 1) {
      requestAnimationFrame(tick)
    }
  }
  requestAnimationFrame(tick)
}

export function ROICalculator() {
  const [emailsPerWeek, setEmailsPerWeek] = useState(100)
  const [currentReplyRate, setCurrentReplyRate] = useState(2)
  const [dealSize, setDealSize] = useState(15000)

  const [displayExtraPipeline, setDisplayExtraPipeline] = useState(0)
  const [displayExtraReplies, setDisplayExtraReplies] = useState(0)
  const [displayTimeSaved, setDisplayTimeSaved] = useState(0)

  const animFrameRef = useRef<number | null>(null)

  const emailsPerMonth = emailsPerWeek * WEEKS_PER_MONTH
  const currentReplies = emailsPerMonth * (currentReplyRate / 100)
  const coldhookReplies = emailsPerMonth * COLDHOOK_REPLY_RATE
  const extraReplies = coldhookReplies - currentReplies
  const extraDeals = extraReplies * MEETING_RATE * CLOSE_RATE
  const extraPipeline = extraDeals * dealSize
  const timeSavedHours = emailsPerMonth * (MINUTES_SAVED_PER_EMAIL / 60)

  useEffect(() => {
    const prevExtraPipeline = displayExtraPipeline
    const prevExtraReplies = displayExtraReplies
    const prevTimeSaved = displayTimeSaved

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current)
    }

    animateValue(prevExtraPipeline, extraPipeline, 400, setDisplayExtraPipeline)
    animateValue(prevExtraReplies, extraReplies, 400, setDisplayExtraReplies)
    animateValue(prevTimeSaved, timeSavedHours, 400, setDisplayTimeSaved)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailsPerWeek, currentReplyRate, dealSize])

  return (
    <section id="calculator" className="py-20 px-6 border-t border-[var(--color-hairline)]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(94,106,210,0.3)] bg-[rgba(94,106,210,0.08)] px-3 py-1 text-xs text-[#828fff] mb-4">
            <TrendingUp className="size-3" />
            ROI Calculator
          </div>
          <h2 className="text-4xl font-semibold tracking-tight text-[var(--color-ink)] mb-4">
            See what ColdHook means for your pipeline
          </h2>
          <p className="text-[var(--color-ink-subtle)] text-lg">
            Adjust the sliders to see the difference better reply rates make.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column — inputs */}
          <div className="space-y-8">
            {/* Emails per week */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-[var(--color-ink)]">
                  Emails per week
                </label>
                <span className="text-sm font-semibold" style={{ color: "var(--color-accent)" }}>
                  {emailsPerWeek}
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={500}
                step={10}
                value={emailsPerWeek}
                onChange={(e) => setEmailsPerWeek(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: "var(--color-accent)" }}
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-[var(--color-ink-subtle)]">10</span>
                <span className="text-xs text-[var(--color-ink-subtle)]">500</span>
              </div>
            </div>

            {/* Current reply rate */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-[var(--color-ink)]">
                  Your current reply rate
                </label>
                <span className="text-sm font-semibold" style={{ color: "var(--color-accent)" }}>
                  {currentReplyRate.toFixed(1)}%
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={15}
                step={0.5}
                value={currentReplyRate}
                onChange={(e) => setCurrentReplyRate(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: "var(--color-accent)" }}
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-[var(--color-ink-subtle)]">1%</span>
                <span className="text-xs text-[var(--color-ink-subtle)]">Industry average is ~2%</span>
                <span className="text-xs text-[var(--color-ink-subtle)]">15%</span>
              </div>
            </div>

            {/* Average deal size */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-[var(--color-ink)]">
                  Average deal size
                </label>
                <span className="text-sm font-semibold" style={{ color: "var(--color-accent)" }}>
                  {formatCurrency(dealSize)}
                </span>
              </div>
              <input
                type="range"
                min={1000}
                max={100000}
                step={1000}
                value={dealSize}
                onChange={(e) => setDealSize(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: "var(--color-accent)" }}
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-[var(--color-ink-subtle)]">$1,000</span>
                <span className="text-xs text-[var(--color-ink-subtle)]">$100,000</span>
              </div>
            </div>
          </div>

          {/* Right column — output */}
          <div
            className="rounded-2xl border p-6"
            style={{
              backgroundColor: "var(--color-surface-1)",
              borderColor: "var(--color-hairline)",
              boxShadow:
                "0 13px 27px rgba(50,50,93,0.25), 0 8px 16px rgba(0,0,0,0.1)",
            }}
          >
            {/* Metric 1: Extra pipeline */}
            <div className="mb-6">
              <p className="text-sm text-[var(--color-ink-subtle)] mb-1">
                Extra pipeline/month
              </p>
              <p
                className="text-4xl font-bold tracking-tight"
                style={{ color: "var(--color-accent)" }}
              >
                {formatCurrency(displayExtraPipeline)}
              </p>
            </div>

            {/* Metric 2: Additional replies */}
            <div className="mb-6">
              <p className="text-sm text-[var(--color-ink-subtle)] mb-1">
                Additional replies/month
              </p>
              <p
                className="text-2xl font-bold tracking-tight"
                style={{ color: "var(--color-success)" }}
              >
                +{Math.round(displayExtraReplies).toLocaleString("en-US")} replies
              </p>
            </div>

            {/* Metric 3: Time saved */}
            <div className="mb-6">
              <p className="text-sm text-[var(--color-ink-subtle)] mb-1">
                Research time saved
              </p>
              <p
                className="text-2xl font-bold tracking-tight"
                style={{ color: "var(--color-email)" }}
              >
                {Math.round(displayTimeSaved).toLocaleString("en-US")} hrs/month
              </p>
            </div>

            {/* Footnote */}
            <p className="text-[10px] text-[var(--color-ink-subtle)] mb-6 leading-relaxed">
              Based on ColdHook&apos;s 34% avg reply rate vs 2% industry average.
              Assumes 20% meeting rate, 20% close rate.
            </p>

            {/* CTA */}
            <Link
              href="/sign-up"
              className="block w-full text-center rounded-lg py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--color-accent)" }}
            >
              Start for free — see for yourself
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
