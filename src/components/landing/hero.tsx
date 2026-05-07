"use client"

import Link from "next/link"
import { useAuth } from "@clerk/nextjs"
import { ArrowRight, Sparkles, Mail, Zap } from "lucide-react"
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
    <section className="relative overflow-hidden pt-24 pb-20 px-6">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(94,106,210,0.15)_0%,transparent_70%)]" />
        <div className="absolute top-32 left-1/4 w-64 h-64 bg-[radial-gradient(circle,rgba(94,106,210,0.08)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute top-48 right-1/4 w-48 h-48 bg-[radial-gradient(circle,rgba(255,128,31,0.06)_0%,transparent_70%)] blur-3xl" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      <motion.div
        className="relative max-w-4xl mx-auto text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Announcement pill */}
        <motion.div className="inline-flex items-center gap-2 mb-8" variants={itemVariants}>
          <span className="flex items-center gap-1.5 rounded-full border border-[rgba(94,106,210,0.3)] bg-[rgba(94,106,210,0.08)] px-3 py-1 text-xs text-[#828fff]">
            <Sparkles className="size-3" />
            Powered by Claude AI
            <ArrowRight className="size-3" />
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl font-semibold leading-[1.05] tracking-[-2px] text-[#f7f8f8] mb-6"
          variants={itemVariants}
        >
          Cold emails that{" "}
          <motion.span
            className="gradient-text-accent"
            animate={{ filter: ["brightness(1)", "brightness(1.6)", "brightness(1)"] }}
            transition={{ duration: 0.6, delay: 1.1, ease: "easeInOut" }}
          >
            actually
          </motion.span>
          <br />
          get replies
        </motion.h1>

        <motion.p
          className="text-lg text-[#8a8f98] max-w-2xl mx-auto mb-10 leading-relaxed"
          variants={itemVariants}
        >
          ColdHook uses AI to write hyper-personalized cold emails in seconds. Feed it a prospect&apos;s LinkedIn, website, or news — get an email that feels hand-crafted.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16"
          variants={itemVariants}
        >
          <Button size="lg" className="h-12 px-8 text-base font-medium" asChild>
            <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
              Start for free
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="h-12 px-8 text-base" asChild>
            <Link href="#demo">
              Watch demo
            </Link>
          </Button>
        </motion.div>

        {/* Beta badge */}
        <motion.div className="flex items-center justify-center" variants={itemVariants}>
          <span className="flex items-center gap-1.5 rounded-full border border-[rgba(39,166,68,0.3)] bg-[rgba(39,166,68,0.08)] px-3 py-1 text-xs text-[#27a644]">
            <Zap className="size-3" />
            Now in beta — free early access
          </span>
        </motion.div>

        {/* App Preview */}
        <motion.div className="mt-16 relative" variants={itemVariants}>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(94,106,210,0.15)_0%,transparent_60%)] pointer-events-none" />
          <motion.div
            whileHover={{ rotateX: 2 }}
            style={{ transformPerspective: 1200 }}
          >
            <AppPreview />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

function AppPreview() {
  return (
    <div className="relative mx-auto max-w-3xl rounded-2xl border border-[#23252a] bg-[#0f1011] overflow-hidden shadow-[0_30px_60px_rgba(3,3,39,0.4),0_18px_36px_rgba(0,0,0,0.35),0_0_0_1px_rgba(94,106,210,0.1)]">
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
