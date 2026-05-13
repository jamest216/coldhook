"use client"

import { motion, useInView, AnimatePresence } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { MoreHorizontal, ArrowUpRight, ChevronUp, Zap, Shield, TrendingUp } from "lucide-react"

const C = {
  bg:           "#010102",
  card:         "#0f1011",
  border:       "#23252a",
  dim:          "#1a1b1f",
  accent:       "#5e6ad2",
  accentBright: "#828fff",
  purple:       "#a78bfa",
  orange:       "#ff801f",
  green:        "#27a644",
  linkedIn:     "#0a66c2",
  textPrimary:  "#f7f8f8",
  textSec:      "#8a8f98",
  textMuted:    "#62666d",
} as const

const fadeInUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
}
const stagger = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
}

const cardBaseStyle = {
  background: `linear-gradient(145deg, #141516 0%, ${C.card} 100%)`,
  boxShadow: "0 1px 0 rgba(255,255,255,0.04) inset, 0 4px 24px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.4)",
}

const cardHover = {
  y: -3,
  boxShadow: "0 1px 0 rgba(255,255,255,0.06) inset, 0 12px 40px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.5)",
  borderColor: "#34343a",
  transition: { duration: 0.2 },
}

const shimmerStyle = {
  background: `linear-gradient(90deg, ${C.accent}10 0%, ${C.accentBright}40 50%, ${C.accent}10 100%)`,
  backgroundSize: "200% 100%",
  animation: "shimmer 2.2s infinite",
}

const tabSubjects = {
  "7d":  "Scaling pipeline at TechScale — quick thought",
  "30d": "Congrats on the Series B, Alex — scaling pipeline at TechScale?",
  "All": "Hey Alex — saw your SDR hiring spree",
} as const

function useCountUp(target: number, duration = 1000, inView = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView) return
    let start: number | null = null
    const step = (timestamp: number) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [inView, target, duration])
  return count
}

function Tag({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium"
      style={{ backgroundColor: `${color}20`, color }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  )
}

function Bar({ pct, color, delay = 0, inView = false }: { pct: number; color: string; delay?: number; inView?: boolean }) {
  return (
    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: C.dim }}>
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: "0%" }}
        animate={{ width: inView ? `${pct}%` : "0%" }}
        transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      />
    </div>
  )
}

function ThickBar({ pct, color, delay = 0, inView = false }: { pct: number; color: string; delay?: number; inView?: boolean }) {
  return (
    <div className="flex-1 h-2.5 rounded overflow-hidden" style={{ backgroundColor: C.dim }}>
      <motion.div
        className="h-full rounded"
        style={{ backgroundColor: color }}
        initial={{ width: "0%" }}
        animate={{ width: inView ? `${pct}%` : "0%" }}
        transition={{ duration: 0.9, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      />
    </div>
  )
}

function LiveDot({ color }: { color: string }) {
  return (
    <span className="relative flex items-center justify-center w-2.5 h-2.5">
      <motion.span
        className="absolute inline-flex rounded-full"
        style={{ backgroundColor: color, width: "100%", height: "100%" }}
        animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0, 0.8] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <span className="relative inline-flex rounded-full w-2 h-2" style={{ backgroundColor: color }} />
    </span>
  )
}

function ProspectCard() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const score = useCountUp(94, 900, inView)

  return (
    <motion.div
      ref={ref}
      variants={fadeInUp}
      className="rounded-xl border p-4 flex flex-col gap-3"
      style={{ borderColor: C.border, ...cardBaseStyle }}
      whileHover={cardHover}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <LiveDot color={C.green} />
          <span className="text-[11px] font-mono" style={{ color: C.textMuted }}>P-0042</span>
        </div>
        <MoreHorizontal className="size-4" style={{ color: C.textMuted }} />
      </div>

      {/* Name */}
      <div>
        <p className="font-semibold text-sm" style={{ color: C.textPrimary }}>Alex Rivera</p>
        <p className="text-[11px]" style={{ color: C.textSec }}>VP of Sales · TechScale Inc.</p>
      </div>

      {/* Buying signal tags */}
      <div className="flex flex-wrap gap-1.5">
        <Tag label="Series B · $24M" color={C.accent} />
        <Tag label="3 SDR hires" color={C.green} />
        <Tag label="Pipeline post" color={C.orange} />
      </div>

      {/* Metadata rows */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px]" style={{ color: C.textMuted }}>Personalization score</span>
          <span className="text-[11px] font-medium" style={{ color: C.textSec }}>{score} / 100</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[11px]" style={{ color: C.textMuted }}>Emails generated</span>
          <span className="text-[11px] font-medium" style={{ color: C.textSec }}>3</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[11px]" style={{ color: C.textMuted }}>Signal detected</span>
          <span className="text-[11px] font-medium" style={{ color: C.textSec }}>14d ago</span>
        </div>
      </div>

      {/* Enriched from */}
      <div>
        <p className="text-[11px] mb-1" style={{ color: C.textMuted }}>Enriched from</p>
        <div className="flex flex-wrap items-center gap-1.5">
          <Tag label="LinkedIn"   color={C.linkedIn} />
          <Tag label="Crunchbase" color={C.orange} />
          <Tag label="News"       color={C.purple} />
          <span className="text-[11px]" style={{ color: C.textMuted }}>+ 2 more</span>
        </div>
      </div>

      {/* Signal strength */}
      <div className="flex flex-col gap-2">
        {[
          { label: "LinkedIn Activity", pct: 90, color: C.accent,  delay: 0.1 },
          { label: "News Mentions",     pct: 55, color: C.purple,  delay: 0.2 },
          { label: "Job Changes",       pct: 35, color: C.orange,  delay: 0.3 },
        ].map(({ label, pct, color, delay }) => (
          <div key={label} className="flex items-center gap-2">
            <span className="text-[11px] w-28 shrink-0" style={{ color: C.textMuted }}>{label}</span>
            <Bar pct={pct} color={color} delay={delay} inView={inView} />
            <span className="text-[11px] w-6 text-right shrink-0" style={{ color: C.textMuted }}>{pct}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function EmailCard() {
  const [activeTab, setActiveTab] = useState<"7d" | "30d" | "All">("30d")
  const spamRef = useRef<HTMLDivElement>(null)
  const spamInView = useInView(spamRef, { once: true })
  const spamCount = useCountUp(12, 700, spamInView)

  return (
    <motion.div
      variants={fadeInUp}
      className="rounded-xl border p-4 flex flex-col gap-3"
      style={{ borderColor: C.border, ...cardBaseStyle }}
      whileHover={cardHover}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold" style={{ color: C.textPrimary }}>Generated Email</p>
        <div className="flex items-center gap-1">
          {(["7d", "30d", "All"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className="px-2 py-0.5 rounded text-[11px] cursor-pointer"
              style={{
                backgroundColor: activeTab === t ? C.border : "transparent",
                color: activeTab === t ? C.textPrimary : C.textMuted,
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Personalization block */}
      <div className="rounded-lg p-3 flex flex-col gap-2" style={{ backgroundColor: C.bg }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span>✨</span>
            <motion.span
              animate={{ opacity: [1, 0.65, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="text-[11px] font-medium"
              style={{ color: C.accentBright }}
            >
              Highly Personalized
            </motion.span>
          </div>
          <ChevronUp className="size-3" style={{ color: C.textMuted }} />
        </div>
        <div>
          <p className="text-[11px] mb-0.5" style={{ color: C.textMuted }}>Subject</p>
          <AnimatePresence mode="wait">
            <motion.p
              key={activeTab}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="text-[11px] font-semibold leading-snug"
              style={{ color: C.textPrimary }}
            >
              {tabSubjects[activeTab]}
            </motion.p>
          </AnimatePresence>
        </div>
        <p className="text-[11px] leading-relaxed" style={{ color: C.textSec }}>
          Your recent raise and the 3 new SDR hires tell me you&apos;re about to push
          pipeline hard. We help VP Sales teams at Series B companies cut
          time-to-meeting by 60%...
        </p>
        <div className="flex flex-wrap gap-1.5">
          <Tag label="Series B signal" color={C.accent} />
          <Tag label="SDR hires"       color={C.green} />
        </div>
      </div>

      {/* A/B variants */}
      <div>
        <p className="text-[11px] mb-1.5" style={{ color: C.textMuted }}>Subject variants</p>
        <div className="flex flex-col gap-1.5">
          {[
            { key: "A", text: "Congrats on the Series B, Alex", winner: true },
            { key: "B", text: "Scaling your SDR team at TechScale?", winner: false },
          ].map(({ key, text, winner }) => (
            <div
              key={key}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-[11px]"
              style={
                winner
                  ? { borderColor: `${C.accent}80`, ...shimmerStyle }
                  : { borderColor: C.border, backgroundColor: "transparent" }
              }
            >
              <span className="font-mono font-bold shrink-0" style={{ color: winner ? C.accentBright : C.textMuted }}>{key}</span>
              <span className="flex-1" style={{ color: winner ? C.textPrimary : C.textSec }}>{text}</span>
              {winner && (
                <span className="text-[10px] font-semibold" style={{ color: C.accentBright }}>Winner</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Spam score */}
      <motion.div
        ref={spamRef}
        initial={{ opacity: 0, scaleX: 0.85 }}
        animate={spamInView ? { opacity: 1, scaleX: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.3, ease: "backOut" }}
        style={{ transformOrigin: "left" }}
      >
        <div
          className="flex items-center justify-between px-3 py-2 rounded-lg border"
          style={{ borderColor: `${C.green}4d`, backgroundColor: `${C.green}14` }}
        >
          <div className="flex items-center gap-1.5">
            <Shield className="size-3.5" style={{ color: C.green }} />
            <span className="text-[11px]" style={{ color: C.textSec }}>Spam Score</span>
          </div>
          <span className="text-[11px] font-semibold" style={{ color: C.green }}>{spamCount} / 100 · Safe to send</span>
        </div>
      </motion.div>
    </motion.div>
  )
}

function SequenceCard() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const r1 = useCountUp(34, 800, inView)
  const r2 = useCountUp(18, 800, inView)
  const r3 = useCountUp(22, 800, inView)
  const t1 = useCountUp(8,  900, inView)
  const t2 = useCountUp(3,  900, inView)
  const t3 = useCountUp(1,  900, inView)

  const steps = [
    { label: "Step 1 · Cold Intro", pct: 34, display: r1, trending: true },
    { label: "Step 2 · Follow-up",  pct: 18, display: r2, trending: false },
    { label: "Step 3 · Break-up",   pct: 22, display: r3, trending: false },
  ]

  const tiers = [
    { tier: "Enterprise", pct: 75, count: t1, color: C.accent,  delay: 0.15 },
    { tier: "Pro",        pct: 45, count: t2, color: C.purple,  delay: 0.25 },
    { tier: "Startup",    pct: 20, count: t3, color: C.orange,  delay: 0.35 },
  ]

  return (
    <motion.div ref={ref} variants={fadeInUp} className="flex flex-col gap-3">
      {/* Sub-card A — Step performance */}
      <motion.div
        className="rounded-xl border p-4 flex flex-col gap-3"
        style={{ borderColor: C.border, ...cardBaseStyle }}
        whileHover={cardHover}
      >
        {/* Tabs */}
        <div className="flex items-center gap-1">
          {["Reply Rate", "Open Rate", "Meetings"].map((tab) => (
            <span
              key={tab}
              className="px-2.5 py-1 rounded-md text-[11px] font-medium border"
              style={
                tab === "Reply Rate"
                  ? { backgroundColor: `${C.accent}33`, borderColor: C.accent, color: C.accentBright }
                  : { backgroundColor: "transparent", borderColor: "transparent", color: C.textMuted }
              }
            >
              {tab}
            </span>
          ))}
        </div>

        {/* Step rows */}
        <div className="flex flex-col gap-2">
          {steps.map(({ label, pct, display, trending }, i) => (
            <div key={label} className="flex items-center gap-2">
              <span className="text-[11px] shrink-0 w-36" style={{ color: C.textMuted }}>{label}</span>
              <Bar pct={Math.min(pct * 2.5, 85)} color={C.accent} delay={0.1 + i * 0.1} inView={inView} />
              <span className="text-[11px] w-7 text-right shrink-0" style={{ color: C.textSec }}>{display}%</span>
              {trending
                ? <TrendingUp className="size-3 shrink-0" style={{ color: C.green }} />
                : <ArrowUpRight className="size-3 shrink-0" style={{ color: C.textMuted }} />
              }
            </div>
          ))}
        </div>
      </motion.div>

      {/* Sub-card B — Prospect tier breakdown */}
      <motion.div
        className="rounded-xl border p-4 flex flex-col gap-3"
        style={{ borderColor: C.border, ...cardBaseStyle }}
        whileHover={cardHover}
      >
        <div>
          <p className="text-[11px]" style={{ color: C.textMuted }}>P-0042</p>
          <p className="text-xs font-semibold" style={{ color: C.textPrimary }}>Alex Rivera · TechScale Inc.</p>
        </div>

        <div className="flex flex-col gap-2">
          {tiers.map(({ tier, pct, count, color, delay }) => (
            <div key={tier} className="flex items-center gap-2">
              <ThickBar pct={pct} color={color} delay={delay} inView={inView} />
              <span className="text-[11px] w-16 shrink-0" style={{ color: C.textMuted }}>{tier}</span>
              <span className="text-[11px] font-medium w-4 text-right shrink-0" style={{ color: C.textSec }}>{count}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

const DESCRIPTIONS = [
  {
    title: "ColdHook detects the right moment.",
    body: "Buying signals like funding rounds, exec hires, and LinkedIn activity surface automatically so your email lands when the prospect is already primed.",
  },
  {
    title: "The AI writes from your perspective.",
    body: "Your value prop, tone, and sender identity shape every word. Personalization and spam scores keep every email sharp and safe to send.",
  },
  {
    title: "Know what's working before you scale.",
    body: "Reply rates, A/B winners, and sequence step performance tell you exactly which emails deserve more volume — and which to retire.",
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 px-6 border-t border-[#23252a]">
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="mb-14"
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(94,106,210,0.3)] bg-[rgba(94,106,210,0.08)] px-3 py-1 text-xs text-[#828fff] mb-4"
          >
            <Zap className="size-3" />
            Features
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            className="text-4xl font-semibold tracking-tight text-[#f7f8f8] mb-4"
          >
            Everything your pipeline needs
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-[#8a8f98] text-lg max-w-2xl">
            From prospect research to send — ColdHook handles the entire cold outreach workflow so you can focus on closing.
          </motion.p>
        </motion.div>

        {/* 3-column live UI cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14"
        >
          <ProspectCard />
          <EmailCard />
          <SequenceCard />
        </motion.div>

        {/* Feature blurbs */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {DESCRIPTIONS.map(({ title, body }) => (
            <motion.p key={title} variants={fadeInUp} className="text-sm leading-relaxed" style={{ color: C.textSec }}>
              <span className="font-semibold" style={{ color: C.textPrimary }}>{title}</span>{" "}
              {body}
            </motion.p>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
