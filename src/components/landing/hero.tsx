"use client"

import Link from "next/link"
import { useAuth } from "@clerk/nextjs"
import { Sparkles, Mail, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
}

export function Hero() {
  const { isSignedIn } = useAuth()
  return (
    <section
      className="relative overflow-hidden pt-24 pb-0 px-6 min-h-[90vh] flex items-center"
      style={{ background: "radial-gradient(125% 125% at 50% 10%, #000 40%, #3b1fa8 100%)" }}
    >
      {/* Grain overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
        }}
      />

      {/* Grid pattern */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-center">

          {/* Left column — text content */}
          <motion.div
            className="text-center lg:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Beta badge */}
            <motion.div
              className="inline-flex items-center justify-center lg:justify-start mb-4"
              variants={itemVariants}
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(39,166,68,0.3)] bg-[rgba(39,166,68,0.08)] px-3 py-1 text-xs text-[var(--color-success)]">
                <span className="size-1.5 rounded-full bg-[var(--color-success)] animate-pulse" />
                Now in beta — free early access
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="text-5xl sm:text-6xl lg:text-7xl"
              variants={itemVariants}
            >
              <span className="block font-black tracking-[-2px] leading-[1.0] text-[var(--color-ink)]">
                Research they feel.
              </span>
              <span className="block text-3xl sm:text-4xl lg:text-5xl font-light gradient-text-accent tracking-[-1px] leading-[1.15] mt-1">
                Time you get back.
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              className="text-base lg:text-lg text-[var(--color-ink-subtle)] max-w-md mx-auto lg:mx-0 leading-relaxed mt-6"
              variants={itemVariants}
            >
              ColdHook researches your prospect — their promotion, funding round, latest post — and writes a cold email that reads like you actually know them. In seconds.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row lg:flex-col items-center lg:items-start gap-3 mt-8"
              variants={itemVariants}
            >
              <Button size="lg" className="h-12 px-8 text-base font-medium" asChild>
                <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
                  Start for free →
                </Link>
              </Button>
              <Link
                href="#demo"
                className="text-sm text-[var(--color-ink-subtle)] hover:text-[var(--color-ink-muted)] transition-colors"
              >
                Watch a demo
              </Link>
            </motion.div>
          </motion.div>

          {/* Right column — app preview */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          >
            <motion.div
              whileHover={{ rotateX: 2 }}
              style={{ transformPerspective: 1200 }}
            >
              <AppPreview />
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

function AppPreview() {
  return (
    <div className="relative mx-auto max-w-3xl rounded-2xl border border-[#23252a] bg-[#0f1011] overflow-hidden shadow-[0_40px_80px_rgba(3,3,39,0.6),0_20px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(94,106,210,0.15),0_0_60px_rgba(94,106,210,0.08)]">
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-[#23252a] px-4 py-3">
        <div className="flex gap-1.5">
          <div className="size-3 rounded-full bg-[#ef4444] opacity-70" />
          <div className="size-3 rounded-full bg-[#f59e0b] opacity-70" />
          <div className="size-3 rounded-full bg-[#27a644] opacity-70" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-1.5 rounded-md border border-[#23252a] bg-[#141516] px-3 py-1 text-xs text-[#62666d]">
            <Zap className="size-3 text-[#5e6ad2]" />
            app.coldhook.io/compose
          </div>
        </div>
      </div>

      {/* App content */}
      <div className="grid grid-cols-2 divide-x divide-[#23252a]">
        {/* Left: Input */}
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="size-6 rounded-md bg-[rgba(94,106,210,0.15)] border border-[rgba(94,106,210,0.2)] flex items-center justify-center">
              <Zap className="size-3 text-[#5e6ad2]" />
            </div>
            <span className="text-xs font-medium text-[#8a8f98]">Prospect Intel</span>
          </div>
          <div className="rounded-md border border-[#23252a] bg-[#141516] p-3">
            <p className="text-xs text-[#62666d] mb-2">LinkedIn URL</p>
            <p className="text-xs text-[#5e6ad2]">linkedin.com/in/sarah-chen-vp</p>
          </div>
          <div className="rounded-md border border-[#23252a] bg-[#141516] p-3">
            <p className="text-xs text-[#62666d] mb-2">Recent trigger</p>
            <p className="text-xs text-[#d0d6e0] leading-relaxed">Sarah just promoted to VP Sales at Acme Corp after leading a 40% ARR growth...</p>
          </div>
          <div className="rounded-md border border-[#23252a] bg-[rgba(94,106,210,0.05)] p-3">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="size-3 text-[#5e6ad2]" />
              <span className="text-xs text-[#5e6ad2] font-medium">Personalization score</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-[#23252a]">
                <div className="h-1.5 w-[87%] rounded-full bg-[#5e6ad2]" />
              </div>
              <span className="text-xs text-[#828fff] font-medium">87%</span>
            </div>
          </div>
        </div>

        {/* Right: Generated email */}
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="size-6 rounded-md bg-[rgba(255,128,31,0.12)] border border-[rgba(255,128,31,0.2)] flex items-center justify-center">
              <Mail className="size-3 text-[#ff801f]" />
            </div>
            <span className="text-xs font-medium text-[#8a8f98]">Generated Email</span>
            <Badge variant="success" className="ml-auto text-[9px] py-0 h-4">Ready</Badge>
          </div>
          <div className="space-y-2">
            <div className="rounded-md bg-[#141516] border border-[#23252a] p-2">
              <p className="text-[10px] text-[#62666d]">Subject</p>
              <p className="text-xs text-[#d0d6e0] mt-0.5">Congrats on the VP promotion, Sarah 🎉</p>
            </div>
            <div className="text-[11px] leading-relaxed text-[#8a8f98] space-y-2">
              <p>Hi Sarah,</p>
              <p>Just saw the announcement about your promotion to VP of Sales at Acme — congrats on the 40% ARR milestone that got you there. That&apos;s the kind of growth that turns heads.</p>
              <p>I help VP-level sales leaders at Series B-D companies shorten ramp time for new AEs by 30% using AI-coached role plays. Given you&apos;re likely rebuilding the team post-promotion...</p>
              <p className="text-[#5e6ad2]">Would 15 mins be worth it?</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
