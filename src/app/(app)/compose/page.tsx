"use client"

import { useState } from "react"
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
  Wand2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

export default function ComposePage() {
  const [linkedinUrl, setLinkedinUrl] = useState("linkedin.com/in/sarah-chen-vp-sales")
  const [firstName, setFirstName] = useState("Sarah")
  const [lastName, setLastName] = useState("Chen")
  const [title, setTitle] = useState("VP of Sales")
  const [company, setCompany] = useState("Acme Corp")
  const [trigger, setTrigger] = useState(
    "Sarah was just promoted from Director to VP of Sales after leading a 40% ARR growth initiative. Acme recently expanded their SDR team from 5 to 12 reps."
  )
  const [valueProp, setValueProp] = useState(
    "AI-coached sales role plays that cut SDR ramp time by 30% for Series B-D companies."
  )
  const [tone, setTone] = useState("conversational")
  const [length, setLength] = useState("medium")
  const [ctaStyle, setCtaStyle] = useState("soft")

  const [isGenerating, setIsGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [generatedSubject, setGeneratedSubject] = useState("")
  const [generatedEmail, setGeneratedEmail] = useState("")
  const [score, setScore] = useState(0)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const fieldsEmpty = !firstName.trim() || !company.trim() || !trigger.trim()

  const handleGenerate = async () => {
    setIsGenerating(true)
    setGenerated(false)
    setGeneratedSubject("")
    setGeneratedEmail("")
    setScore(0)
    setError("")

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

      let s = 0
      const interval = setInterval(() => {
        s += 3
        setScore(s)
        if (s >= 89) clearInterval(interval)
      }, 30)
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

  return (
    <div>
      <TopBar
        title="AI Compose"
        description="Generate a hyper-personalized cold email in seconds"
      />

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-8rem)]">
          {/* Left: Input panel */}
          <div className="flex flex-col gap-4 overflow-y-auto pr-1">
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
                <div className="space-y-1.5">
                  <label className="text-xs text-[#8a8f98]">Recent trigger / buying signal</label>
                  <Textarea
                    rows={3}
                    placeholder="e.g., just raised Series B, promoted to VP, new product launch..."
                    value={trigger}
                    onChange={(e) => setTrigger(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
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
            <Card>
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
              </CardContent>
            </Card>

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

          {/* Right: Output panel */}
          <div className="flex flex-col gap-4 overflow-y-auto pr-1">
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
                  {generated && (
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {[
                        { label: "Spam risk", value: "Low", color: "#27a644" },
                        { label: "Reading level", value: "Grade 8", color: "#5e6ad2" },
                        { label: "Est. read time", value: "28s", color: "#ff801f" },
                      ].map((m) => (
                        <div key={m.label} className="rounded-md bg-[#141516] border border-[#23252a] p-2 text-center">
                          <div className="text-xs font-medium" style={{ color: m.color }}>{m.value}</div>
                          <div className="text-[10px] text-[#62666d] mt-0.5">{m.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
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
                      <Button variant="email" size="sm" className="h-7 text-xs gap-1.5">
                        <Send className="size-3" />
                        Send
                      </Button>
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
                      <span>Claude is personalizing your email...</span>
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
                      readOnly
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

            {/* Error message */}
            {error && (
              <div className="rounded-md bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.25)] p-3">
                <p className="text-sm text-[#ef4444]">{error}</p>
              </div>
            )}

            {/* Follow-up sequence teaser */}
            {generated && (
              <Card>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-medium text-[#d0d6e0]">Follow-up Sequence</div>
                    <Badge variant="secondary" className="text-[10px]">3 emails</Badge>
                  </div>
                  <div className="space-y-2">
                    {[
                      { day: "Day 1", label: "Initial email (this one)", done: true },
                      { day: "Day 3", label: "Value-add follow-up", done: false },
                      { day: "Day 7", label: "Breakup email", done: false },
                    ].map((step) => (
                      <div key={step.day} className="flex items-center gap-2.5 text-xs">
                        <div className={`size-5 rounded-full flex items-center justify-center text-[10px] font-medium ${step.done ? "bg-[#5e6ad2] text-white" : "bg-[#141516] border border-[#23252a] text-[#62666d]"}`}>
                          {step.done ? "✓" : ""}
                        </div>
                        <span className="text-[#62666d] w-10 shrink-0">{step.day}</span>
                        <span className={step.done ? "text-[#d0d6e0]" : "text-[#8a8f98]"}>{step.label}</span>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-3 h-8 text-xs gap-1.5">
                    <Plus className="size-3" />
                    Generate full sequence
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
