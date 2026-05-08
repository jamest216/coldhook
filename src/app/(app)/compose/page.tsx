"use client"

import { useState, useEffect, useCallback, useRef, useMemo, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { OnboardingTour, type TourStep } from "@/components/onboarding/tour"
import { TopBar } from "@/components/layout/top-bar"
import {
  Sparkles,
  Link2,
  Globe,
  FileText,
  Send,
  Copy,
  RefreshCw,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Wand2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { computePersonalizationScore, computeSpamScore } from "@/lib/scoring"

function ComposePageInner() {
  const [linkedinUrl, setLinkedinUrl] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [title, setTitle] = useState("")
  const [company, setCompany] = useState("")
  const [trigger, setTrigger] = useState("")
  const [valueProp, setValueProp] = useState("")
  const [tone, setTone] = useState("conversational")
  const [length, setLength] = useState("medium")
  const [ctaStyle, setCtaStyle] = useState("soft")
  const [industry, setIndustry] = useState("tech_saas")

  const [isGenerating, setIsGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [generatedSubject, setGeneratedSubject] = useState("")
  const [generatedEmail, setGeneratedEmail] = useState("")
  const [score, setScore] = useState(0)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [spamScore, setSpamScore] = useState(100)
  const [spamFlags, setSpamFlags] = useState<
    Array<{ rule: string; severity: string; deduction: number; detail: string }>
  >([])

  type SequenceEmail = { subject: string; email: string }
  const [sequence, setSequence] = useState<{ day3: SequenceEmail; day7: SequenceEmail } | null>(null)
  const [isGeneratingSequence, setIsGeneratingSequence] = useState(false)
  const [sequenceError, setSequenceError] = useState("")
  const [expandedStep, setExpandedStep] = useState<"day3" | "day7" | null>(null)

  // Pipeline visibility state
  const [insight, setInsight] = useState("")
  const [enrichedContext, setEnrichedContext] = useState("")
  const [critiqueResult, setCritiqueResult] = useState<{ passed: boolean; issues: string[] } | null>(null)
  const [pipelineOpen, setPipelineOpen] = useState(false)

  // Loading stage cycling
  const [loadingStage, setLoadingStage] = useState(0)

  // Panel refs for scroll locking during tour
  const leftPanelRef = useRef<HTMLDivElement>(null)
  const rightPanelRef = useRef<HTMLDivElement>(null)

  const lockPanels = useCallback(() => {
    if (leftPanelRef.current)  leftPanelRef.current.style.overflowY = "hidden"
    if (rightPanelRef.current) rightPanelRef.current.style.overflowY = "hidden"
  }, [])

  const unlockPanels = useCallback(() => {
    if (leftPanelRef.current)  leftPanelRef.current.style.overflowY = "auto"
    if (rightPanelRef.current) rightPanelRef.current.style.overflowY = "auto"
  }, [])

  // Onboarding tour state
  const searchParams = useSearchParams()
  const [tourActive, setTourActive] = useState(false)
  const [tourStep, setTourStep] = useState(0)

  useEffect(() => {
    if (searchParams.get("onboarding") !== "true") return
    // URL param is explicit intent — always start the tour regardless of localStorage
    setFirstName("Alex")
    setLastName("Rivera")
    setTitle("VP of Sales")
    setCompany("Northstar")
    setTrigger("Just promoted internally from Senior Account Executive to VP of Sales at Northstar, announced on LinkedIn two days ago")
    setTourActive(true)
    setTourStep(0)
  }, [])

  useEffect(() => {
    if (!tourActive) return
    // Index 4 = pipeline-panel step
    if (tourStep === 4 && generated) {
      setPipelineOpen(true)
    }
  }, [tourStep, tourActive, generated])

  const populateTourMockData = () => {
    setGeneratedSubject("The promotion clock — and what it means for your first 90 days")
    setGeneratedEmail(
      `Alex,\n\nCongratulations on the VP of Sales seat at Northstar. Internal promotions carry a different kind of pressure than outside hires — you already know where the bodies are buried, which means leadership is watching whether you'll act on it.\n\nMost new VPs spend the first 60 days rebuilding what the previous team left behind. The ones who don't are usually the ones who had infrastructure that told them exactly where time was being lost before they ever stepped into the role.\n\nWorth a 15-minute conversation to see if that's relevant to where you are right now?\n\n— [Your name]`
    )
    setScore(74)
    setSpamScore(91)
    setSpamFlags([])
    setInsight("Alex's internal promotion signals Northstar is betting on organic talent over outside hires — meaning he owns the outcome, not just the process. The pressure isn't to learn the job; it's to prove the bet was right.")
    setEnrichedContext("Trigger type: promotion. Alex Rivera moved from Senior AE to VP of Sales at Northstar — internal, not an outside hire. Announced on LinkedIn 2 days ago. Northstar is likely a growth-stage company building out its sales org. The promotion signals the company values continuity and domain knowledge over external pedigree.")
    setCritiqueResult({ passed: true, issues: [] })
    setGenerated(true)
    setPipelineOpen(true)
  }

  const handleTourNext = () => {
    // Step 4 (index 3) is the generate-btn step — inject mock data instead of requiring real generation
    if (tourStep === 3 && tourActive) {
      populateTourMockData()
      setTourStep(4)
      return
    }
    if (tourStep < tourSteps.length - 1) {
      setTourStep((s) => s + 1)
    } else {
      handleTourComplete()
    }
  }

  const handleTourComplete = () => {
    setTourActive(false)
    if (typeof window !== "undefined") {
      localStorage.setItem("coldhook_tour_complete", "true")
    }
  }

  const tourSteps: TourStep[] = useMemo(() => [
    {
      tourId: "trigger",
      title: "Start with a buying signal",
      description: "Paste in a recent trigger — a promotion, funding round, or LinkedIn post. ColdHook turns this into the hook that makes your email feel researched, not blasted.",
      nextLabel: "Got it →",
    },
    {
      tourId: "valueprop",
      title: "What are you selling?",
      description: "Describe your pitch in plain English. ColdHook uses this to connect your offer to the prospect's specific situation — not a generic value proposition.",
      nextLabel: "Next →",
    },
    {
      tourId: "settings",
      title: "Tune tone and length",
      description: "Pick a tone and length that match how you sell. These settings shape how the AI writes, not just what it says.",
      nextLabel: "Next →",
    },
    {
      tourId: "generate-btn",
      title: "Generate your email",
      description: "Hit Generate. ColdHook runs a 4-stage AI pipeline — it enriches the signal, builds a key insight, drafts the email, then self-critiques before you see it.",
      nextLabel: "See it in action →",
    },
    {
      tourId: "pipeline-panel",
      title: "See how it was written",
      description: "Expand this panel to see every reasoning step the AI took — from raw signal to final draft. No black boxes.",
      nextLabel: "Next →",
      position: "top",
    },
    {
      tourId: "sequence-section",
      title: "Build out the sequence",
      description: "Generate Day 3 and Day 7 follow-ups in one click. Each one is written to feel like a natural continuation, not a copy-paste nudge.",
      nextLabel: "Done — let me compose",
      position: "top",
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [generated])

  const fieldsEmpty = !firstName.trim() || !company.trim() || !trigger.trim()

  const loadingStages = [
    "Enriching signal...",
    "Generating insight...",
    "Drafting email...",
    "Running quality check...",
  ]

  useEffect(() => {
    if (!isGenerating) {
      setLoadingStage(0)
      return
    }
    const interval = setInterval(() => {
      setLoadingStage((s) => (s + 1) % loadingStages.length)
    }, 1800)
    return () => clearInterval(interval)
  }, [isGenerating])

  const handleGenerate = async () => {
    setIsGenerating(true)
    setGenerated(false)
    setGeneratedSubject("")
    setGeneratedEmail("")
    setScore(0)
    setError("")
    setInsight("")
    setEnrichedContext("")
    setCritiqueResult(null)
    setPipelineOpen(false)

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          linkedinUrl,
          firstName,
          lastName,
          title,
          company,
          trigger,
          valueProp,
          tone,
          length,
          ctaStyle,
          industry,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to generate email.")
      }

      const data = await res.json()
      setGeneratedSubject(data.subject)
      setGeneratedEmail(data.email)
      setIsGenerating(false)
      setGenerated(true)

      const targetScore = data.score ?? 0
      const step = Math.max(1, Math.ceil(targetScore / 30))
      let s = 0
      const interval = setInterval(() => {
        s += step
        if (s >= targetScore) {
          setScore(targetScore)
          clearInterval(interval)
        } else {
          setScore(s)
        }
      }, 30)

      setSpamScore(data.spamScore ?? 100)
      setSpamFlags(data.spamFlags ?? [])
      setInsight(data.insight ?? "")
      setEnrichedContext(data.enrichedContext ?? "")
      setCritiqueResult(data.critiqueResult ?? null)
      if (data.insight || data.enrichedContext) {
        setPipelineOpen(true)
      }
    } catch (e) {
      setIsGenerating(false)
      setError(e instanceof Error ? e.message : "Something went wrong.")
    }
  }

  const handleCopy = async () => {
    const text = generatedSubject
      ? `Subject: ${generatedSubject}\n\n${generatedEmail}`
      : generatedEmail
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleEmailEdit = (value: string) => {
    setGeneratedEmail(value)
    const persResult = computePersonalizationScore({
      body: value,
      subject: generatedSubject,
      firstName,
      company,
      trigger,
    })
    setScore(persResult.score)
    const spamResult = computeSpamScore({ subject: generatedSubject, body: value })
    setSpamScore(spamResult.score)
    setSpamFlags(spamResult.flags)
  }

  const handleGenerateSequence = async () => {
    setIsGeneratingSequence(true)
    setSequenceError("")
    setSequence(null)
    setExpandedStep(null)
    try {
      const res = await fetch("/api/generate-sequence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName, lastName, title, company, trigger, valueProp, tone, ctaStyle,
          industry,
          initialEmail: generatedEmail,
          initialSubject: generatedSubject,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to generate sequence.")
      }
      const data = await res.json()
      setSequence(data)
      if (tourActive && tourStep === 5) {
        setTimeout(handleTourComplete, 1200)
      }
    } catch (e) {
      setSequenceError(e instanceof Error ? e.message : "Something went wrong.")
    } finally {
      setIsGeneratingSequence(false)
    }
  }

  return (
    <div>
      <OnboardingTour
        steps={tourSteps}
        currentStep={tourStep}
        onNext={handleTourNext}
        onSkip={handleTourComplete}
        isActive={tourActive}
        onLockScroll={lockPanels}
        onUnlockScroll={unlockPanels}
        onStepChange={(stepIndex) => {
          // When tour reaches pipeline-panel step (index 4), ensure panel is open
          if (stepIndex === 4 && generated) {
            setPipelineOpen(true)
          }
        }}
      />
      <TopBar
        title="AI Compose"
        description="Generate a hyper-personalized cold email in seconds"
        action={
          <button
            onClick={() => {
              setFirstName("Alex")
              setLastName("Rivera")
              setTitle("VP of Sales")
              setCompany("Northstar")
              setTrigger("Just promoted internally from Senior Account Executive to VP of Sales at Northstar, announced on LinkedIn two days ago")
              setTourStep(0)
              setTourActive(true)
              if (typeof window !== "undefined") {
                localStorage.removeItem("coldhook_tour_complete")
              }
            }}
            className="flex items-center gap-1.5 text-xs text-[#62666d] hover:text-[#8a8f98] border border-[#23252a] hover:border-[#34343a] rounded-lg px-3 py-1.5 transition-colors"
          >
            <Sparkles className="size-3" />
            Take a tour
          </button>
        }
      />

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-8rem)]">
          {/* Left: Input panel */}
          <div ref={leftPanelRef} className="flex flex-col gap-4 overflow-y-auto pr-1">
            {/* Prospect info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <div className="size-5 rounded bg-[rgba(255,128,31,0.12)] border border-[rgba(255,128,31,0.2)] flex items-center justify-center">
                    <Globe className="size-3 text-[#ff801f]" />
                  </div>
                  Prospect Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-[#8a8f98]">LinkedIn URL</label>
                  <div className="relative">
                    <Link2 className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-[#0a66c2]" />
                    <Input
                      placeholder="linkedin.com/in/sarah-chen-vp"
                      className="pl-8"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs text-[#8a8f98]">First Name</label>
                    <Input
                      placeholder="Sarah"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-[#8a8f98]">Last Name</label>
                    <Input
                      placeholder="Chen"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs text-[#8a8f98]">Title</label>
                    <Input
                      placeholder="VP of Sales"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-[#8a8f98]">Company</label>
                    <Input
                      placeholder="Acme Corp"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trigger / Context */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <div className="size-5 rounded bg-[rgba(94,106,210,0.12)] border border-[rgba(94,106,210,0.2)] flex items-center justify-center">
                    <Sparkles className="size-3 text-[#5e6ad2]" />
                  </div>
                  Personalization Hooks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5" data-tour="trigger">
                  <label className="text-xs text-[#8a8f98]">Recent trigger / buying signal</label>
                  <Textarea
                    rows={3}
                    placeholder="e.g., just raised Series B, promoted to VP, new product launch..."
                    value={trigger}
                    onChange={(e) => setTrigger(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5" data-tour="valueprop">
                  <label className="text-xs text-[#8a8f98]">Your pitch / value prop</label>
                  <Textarea
                    rows={2}
                    placeholder="What do you sell and who is it for?"
                    value={valueProp}
                    onChange={(e) => setValueProp(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Email settings */}
            <Card data-tour="settings">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <div className="size-5 rounded bg-[rgba(39,166,68,0.12)] border border-[rgba(39,166,68,0.2)] flex items-center justify-center">
                    <FileText className="size-3 text-[#27a644]" />
                  </div>
                  Email Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs text-[#8a8f98]">Tone</label>
                    <Select value={tone} onValueChange={setTone}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conversational">Conversational</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="bold">Bold & Direct</SelectItem>
                        <SelectItem value="curious">Curious</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-[#8a8f98]">Length</label>
                    <Select value={length} onValueChange={setLength}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Short (3 lines)</SelectItem>
                        <SelectItem value="medium">Medium (75 words)</SelectItem>
                        <SelectItem value="long">Long (120 words)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-[#8a8f98]">CTA Style</label>
                  <Select value={ctaStyle} onValueChange={setCtaStyle}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="soft">Soft ask (15 min chat?)</SelectItem>
                      <SelectItem value="calendar">Calendar link</SelectItem>
                      <SelectItem value="question">Question CTA</SelectItem>
                      <SelectItem value="bold">Bold ask (demo this week?)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-[#8a8f98]">Industry</label>
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tech_saas">Tech / SaaS</SelectItem>
                      <SelectItem value="fintech_finance">Fintech / Finance</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="legal">Legal</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing / Industrial</SelectItem>
                      <SelectItem value="agency">Agency / Creative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <div data-tour="generate-btn">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || fieldsEmpty}
                className="w-full h-11 text-base font-medium gap-2"
                style={{ opacity: isGenerating || fieldsEmpty ? 0.5 : 1 }}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="size-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="size-4" />
                    Generate Email
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Right: Output panel */}
          <div ref={rightPanelRef} className="flex flex-col gap-4 overflow-y-auto pr-1">
            {/* Score */}
            {(generated || isGenerating) && (
              <Card className={generated ? "border-[rgba(94,106,210,0.3)]" : ""}>
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#8a8f98]">Personalization score</span>
                        <span className="font-semibold text-[#828fff]">{score}%</span>
                      </div>
                      <Progress value={score} />
                    </div>
                    {score > 80 && (
                      <Badge variant="success" className="gap-1 shrink-0">
                        <CheckCircle2 className="size-3" />
                        High quality
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Spam check — flags found */}
            {generated && spamFlags.length > 0 && (
              <Card className="border-[rgba(255,128,31,0.3)]">
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[var(--color-ink-subtle)]">Spam score</span>
                        <span className="font-semibold text-[var(--color-email)]">{spamScore}%</span>
                      </div>
                      <Progress
                        value={spamScore}
                        className="[&>div]:bg-[var(--color-email)]"
                      />
                    </div>
                  </div>
                  {spamFlags.map((flag: { rule: string; severity: string; deduction: number; detail: string }, i: number) => (
                    <div key={i} className="flex items-start gap-2 text-xs py-1">
                      <AlertTriangle className="size-3 shrink-0 mt-0.5 text-[var(--color-email)]" />
                      <div>
                        <span className="text-[var(--color-ink)] font-medium">{flag.rule}</span>
                        <span className="text-[var(--color-ink-subtle)] ml-1">{flag.detail}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Spam check — clean */}
            {generated && spamScore >= 80 && spamFlags.length === 0 && (
              <Card className="border-[rgba(39,166,68,0.2)]">
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[var(--color-ink-subtle)]">Spam check</span>
                        <span className="font-semibold text-[var(--color-success)]">{spamScore}%</span>
                      </div>
                      <Progress
                        value={spamScore}
                        className="[&>div]:bg-[var(--color-success)]"
                      />
                    </div>
                    <Badge variant="success" className="gap-1 shrink-0">
                      <CheckCircle2 className="size-3" />
                      Clean
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Generated email */}
            <Card className="flex-1">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Generated Email</CardTitle>
                  {generated && (
                    <div className="flex items-center gap-1.5">
                      <Button variant="ghost" size="icon-sm" className="size-7" onClick={handleGenerate}>
                        <RefreshCw className="size-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" className="size-7" onClick={handleCopy}>
                        {copied ? (
                          <CheckCircle2 className="size-3.5 text-[#27a644]" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                      </Button>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>
                              <Button variant="email" size="sm" className="h-7 text-xs gap-1.5" disabled>
                                <Send className="size-3" />
                                Send
                              </Button>
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            Email sending coming soon — copy your email above for now
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isGenerating ? (
                  <div className="space-y-3">
                    {[80, 60, 90, 70, 85, 40].map((w, i) => (
                      <div
                        key={i}
                        className="h-3 rounded-full bg-[#141516] animate-pulse"
                        style={{ width: `${w}%` }}
                      />
                    ))}
                    <div className="flex items-center gap-2 mt-4 text-xs text-[#5e6ad2]">
                      <Sparkles className="size-3 animate-pulse" />
                      <span className="transition-opacity duration-300">
                        {loadingStages[loadingStage]}
                      </span>
                    </div>
                  </div>
                ) : generated ? (
                  <div className="space-y-4">
                    <div className="rounded-lg bg-[#141516] border border-[#23252a] p-3">
                      <p className="text-[10px] text-[#62666d] mb-1 uppercase tracking-wider">Subject Line</p>
                      <p className="text-sm text-[#f7f8f8] font-medium">{generatedSubject}</p>
                    </div>
                    <Textarea
                      value={generatedEmail}
                      rows={14}
                      className="text-sm leading-relaxed font-mono text-[#d0d6e0]"
                      onChange={(e) => handleEmailEdit(e.target.value)}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-center">
                    <div className="size-12 rounded-2xl bg-[rgba(94,106,210,0.08)] border border-[rgba(94,106,210,0.15)] flex items-center justify-center mb-3">
                      <Wand2 className="size-6 text-[#5e6ad2]" />
                    </div>
                    <p className="text-sm text-[#8a8f98] mb-1">No email yet</p>
                    <p className="text-xs text-[#62666d]">Fill in the prospect details and click Generate</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pipeline transparency panel */}
            {generated && (insight || enrichedContext) && (
              <Card data-tour="pipeline-panel">
                <CardContent className="pt-4 pb-3">
                  <button
                    className="w-full flex items-center justify-between text-xs"
                    onClick={() => setPipelineOpen((o) => !o)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="size-5 rounded bg-[rgba(94,106,210,0.12)] border border-[rgba(94,106,210,0.2)] flex items-center justify-center">
                        <Sparkles className="size-3 text-[#5e6ad2]" />
                      </div>
                      <span className="font-medium text-[#d0d6e0]">How this was written</span>
                    </div>
                    <span className="text-[#5e6ad2]">{pipelineOpen ? "▲ hide" : "▼ show"}</span>
                  </button>

                  {pipelineOpen && (
                    <div className="mt-3 space-y-3">

                      {/* Stage 1 — Signal */}
                      {enrichedContext && (
                        <div className="rounded-md border border-[#23252a] bg-[#141516] p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="size-4 rounded-full bg-[rgba(94,106,210,0.2)] text-[#828fff] text-[10px] font-bold flex items-center justify-center">1</span>
                            <span className="text-xs font-medium text-[#8a8f98]">Signal enrichment</span>
                          </div>
                          <p className="text-xs text-[#d0d6e0] leading-relaxed">
                            {enrichedContext}
                          </p>
                        </div>
                      )}

                      {/* Stage 2 — Insight */}
                      {insight && (
                        <div className="rounded-md border border-[#23252a] bg-[#141516] p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="size-4 rounded-full bg-[rgba(94,106,210,0.2)] text-[#828fff] text-[10px] font-bold flex items-center justify-center">2</span>
                            <span className="text-xs font-medium text-[#8a8f98]">Key insight</span>
                          </div>
                          <p className="text-xs text-[#d0d6e0] leading-relaxed">
                            {insight}
                          </p>
                        </div>
                      )}

                      {/* Stage 4 — Quality check */}
                      {critiqueResult && (
                        <div className="rounded-md border border-[#23252a] bg-[#141516] p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="size-4 rounded-full bg-[rgba(94,106,210,0.2)] text-[#828fff] text-[10px] font-bold flex items-center justify-center">4</span>
                            <span className="text-xs font-medium text-[#8a8f98]">Quality check</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className={`size-3.5 shrink-0 mt-0.5 ${critiqueResult.passed ? "text-[#27a644]" : "text-[#ff801f]"}`} />
                            <p className="text-xs text-[#d0d6e0] leading-relaxed">
                              {critiqueResult.passed
                                ? "Passed all craft checks — email sent as generated."
                                : `Revised after catching: ${critiqueResult.issues.join(", ")}`
                              }
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Error message */}
            {error && (
              <div className="rounded-md bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.25)] p-3">
                <p className="text-sm text-[#ef4444]">{error}</p>
              </div>
            )}

            {/* Follow-up sequence */}
            {generated && (
              <Card data-tour="sequence-section">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-medium text-[#d0d6e0]">Follow-up Sequence</div>
                    <Badge variant="secondary" className="text-[10px]">3 emails</Badge>
                  </div>
                  <div className="space-y-2">
                    {/* Day 1 — always done */}
                    <div className="flex items-center gap-2.5 text-xs">
                      <div className="size-5 rounded-full flex items-center justify-center text-[10px] font-medium bg-[#5e6ad2] text-white">✓</div>
                      <span className="text-[#62666d] w-10 shrink-0">Day 1</span>
                      <span className="text-[#d0d6e0]">Initial email (this one)</span>
                    </div>

                    {/* Day 3 */}
                    <div className="space-y-1.5">
                      <div
                        className="flex items-center gap-2.5 text-xs cursor-pointer"
                        onClick={() => sequence && setExpandedStep(expandedStep === "day3" ? null : "day3")}
                      >
                        <div className={`size-5 rounded-full flex items-center justify-center text-[10px] font-medium ${sequence ? "bg-[#5e6ad2] text-white" : "bg-[#141516] border border-[#23252a] text-[#62666d]"}`}>
                          {sequence ? "✓" : ""}
                        </div>
                        <span className="text-[#62666d] w-10 shrink-0">Day 3</span>
                        <span className={sequence ? "text-[#d0d6e0]" : "text-[#8a8f98]"}>
                          {sequence ? sequence.day3.subject : "Value-add follow-up"}
                        </span>
                        {sequence && (
                          <span className="ml-auto text-[#5e6ad2] text-[10px]">{expandedStep === "day3" ? "▲" : "▼"}</span>
                        )}
                      </div>
                      {expandedStep === "day3" && sequence && (
                        <div className="ml-7 rounded-md bg-[#141516] border border-[#23252a] p-2.5 space-y-2">
                          <p className="text-[10px] text-[#62666d] uppercase tracking-wider">Subject</p>
                          <p className="text-xs text-[#f7f8f8] font-medium">{sequence.day3.subject}</p>
                          <p className="text-xs text-[#d0d6e0] whitespace-pre-wrap leading-relaxed">{sequence.day3.email}</p>
                        </div>
                      )}
                    </div>

                    {/* Day 7 */}
                    <div className="space-y-1.5">
                      <div
                        className="flex items-center gap-2.5 text-xs cursor-pointer"
                        onClick={() => sequence && setExpandedStep(expandedStep === "day7" ? null : "day7")}
                      >
                        <div className={`size-5 rounded-full flex items-center justify-center text-[10px] font-medium ${sequence ? "bg-[#5e6ad2] text-white" : "bg-[#141516] border border-[#23252a] text-[#62666d]"}`}>
                          {sequence ? "✓" : ""}
                        </div>
                        <span className="text-[#62666d] w-10 shrink-0">Day 7</span>
                        <span className={sequence ? "text-[#d0d6e0]" : "text-[#8a8f98]"}>
                          {sequence ? sequence.day7.subject : "Breakup email"}
                        </span>
                        {sequence && (
                          <span className="ml-auto text-[#5e6ad2] text-[10px]">{expandedStep === "day7" ? "▲" : "▼"}</span>
                        )}
                      </div>
                      {expandedStep === "day7" && sequence && (
                        <div className="ml-7 rounded-md bg-[#141516] border border-[#23252a] p-2.5 space-y-2">
                          <p className="text-[10px] text-[#62666d] uppercase tracking-wider">Subject</p>
                          <p className="text-xs text-[#f7f8f8] font-medium">{sequence.day7.subject}</p>
                          <p className="text-xs text-[#d0d6e0] whitespace-pre-wrap leading-relaxed">{sequence.day7.email}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {sequenceError && (
                    <div className="mt-3 rounded-md bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.25)] p-2">
                      <p className="text-xs text-[#ef4444]">{sequenceError}</p>
                    </div>
                  )}

                  {!sequence && (
                    <Button
                      variant="outline"
                      className="w-full mt-3 h-8 text-xs gap-1.5"
                      onClick={handleGenerateSequence}
                      disabled={isGeneratingSequence}
                    >
                      {isGeneratingSequence ? (
                        <>
                          <RefreshCw className="size-3 animate-spin" />
                          Generating sequence...
                        </>
                      ) : (
                        <>
                          <Plus className="size-3" />
                          Generate full sequence
                        </>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ComposePage() {
  return (
    <Suspense>
      <ComposePageInner />
    </Suspense>
  )
}
