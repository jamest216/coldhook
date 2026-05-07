import { anthropic } from "@ai-sdk/anthropic"
import { generateText } from "ai"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { emails } from "@/lib/db/schema"
import { computePersonalizationScore, computeSpamScore } from "@/lib/scoring"

type TriggerType = "promotion" | "funding" | "content" | "job_change" | "other"

type SeniorityLevel = "c_suite" | "vp" | "director" | "manager_ic"

type IndustryVertical = "tech_saas" | "fintech_finance" | "healthcare" | "legal" | "manufacturing" | "agency"

function classifyTrigger(trigger: string): TriggerType {
  const t = trigger.toLowerCase()
  if (/\b(promot|vp |cro|cmo|cto|ceo|chief|head of|director|new role|stepped into|just became)\b/.test(t)) return "promotion"
  if (/\b(series [abcde]|seed round|raised|funding|raise|investors|led by|venture|capital)\b/.test(t)) return "funding"
  if (/\b(podcast|episode|post|article|talk|spoke|wrote|published|interview|webinar|keynote|linkedin post)\b/.test(t)) return "content"
  if (/\b(joined|just joined|started at|new job|moved to|left .+ for|now at)\b/.test(t)) return "job_change"
  return "other"
}

function classifySeniority(title: string): SeniorityLevel {
  const t = title.toLowerCase()
  if (/\b(ceo|cro|cto|cmo|cfo|coo|cpo|chief|founder|co-founder|president|owner)\b/.test(t)) return "c_suite"
  if (/\b(vp|vice president|head of|svp|evp|senior vp|group vp)\b/.test(t)) return "vp"
  if (/\b(director|sr\. director|senior director|principal)\b/.test(t)) return "director"
  return "manager_ic"
}

function classifyIndustry(industry: string): IndustryVertical {
  const i = industry.toLowerCase()
  if (i.includes("finance") || i.includes("fintech") || i.includes("banking") || i.includes("investment")) return "fintech_finance"
  if (i.includes("health") || i.includes("medical") || i.includes("pharma") || i.includes("clinical")) return "healthcare"
  if (i.includes("legal") || i.includes("law") || i.includes("compliance")) return "legal"
  if (i.includes("manufactur") || i.includes("industrial") || i.includes("logistics") || i.includes("supply chain")) return "manufacturing"
  if (i.includes("agency") || i.includes("creative") || i.includes("marketing agency") || i.includes("design studio")) return "agency"
  return "tech_saas"
}

async function generateInsight(fields: {
  firstName: string
  title: string
  company: string
  trigger: string
  triggerType: TriggerType
  seniority: SeniorityLevel
  industryVertical: IndustryVertical
}): Promise<string> {
  const triggerContext: Record<string, string> = {
    promotion: `Focus on: what specific operational and political challenges come with this exact role transition. What does this person now have to prove, build, or fix that they didn't before? What mandate do they likely have?`,
    funding: `Focus on: what the round size and stage actually mean in operational pressure — hiring timelines, board expectations, burn rate, GTM acceleration. What is the person in this seat now accountable for that they weren't before the round closed?`,
    content: `Focus on: the specific argument or perspective they expressed — what does holding that view imply about how they see their biggest problem right now? What would a peer say in response?`,
    job_change: `Focus on: the gap between where they came from and where they've landed. What expectations does their previous company set that won't match reality at the new company? What audit are they already running?`,
    other: `Focus on: what this trigger event implies is changing or under pressure in their world right now. What problem does it surface that probably wasn't urgent 3 months ago?`,
  }

  const seniorityFocus: Record<string, string> = {
    c_suite: `This is a ${fields.title}. Frame the implication at the STRATEGIC level: board narrative, competitive position, company valuation, next 18-month horizon. Do not mention team processes or operational workflows. Think: what does their board care about? What does this trigger mean for how they'll be judged in 12 months?`,
    vp: `This is a VP-level leader. Frame the implication at the OPERATIONAL level: scaling their function, hiring and ramp, systems breaking under growth, quota and coverage. They own a function and have to scale it — the insight should speak to that pressure, not to C-level strategy or individual contributor tactics.`,
    director: `This is a Director. Frame the implication at the PRACTICAL level: hitting their team's number, solving a specific process problem, surviving the next quarter. They are operational and execution-focused. Think: what does this trigger make harder or more urgent for their team to deliver?`,
    manager_ic: `This is a Manager or individual contributor. Frame the implication at the TACTICAL level: their day-to-day workflow, a specific skill or tool problem, something that makes their job harder or easier. Be specific and concrete.`,
  }

  const industryContext: Record<string, string> = {
    tech_saas: `Tech/SaaS context. Use product-led and GTM vocabulary (pipeline, ARR, churn, ramp, PLG, outbound). Assume familiarity with modern sales and engineering concepts.`,
    fintech_finance: `Fintech/Finance context. Use precise financial vocabulary. Implications may relate to compliance, regulatory pressure, risk management, or capital efficiency. Be exact with figures.`,
    healthcare: `Healthcare context. Implications may relate to patient outcomes, compliance (HIPAA/FDA), reimbursement, clinical workflows, or staffing. Be careful with claims — avoid overpromising on outcomes.`,
    legal: `Legal context. Implications may relate to case load, compliance risk, client retention, billing efficiency, or regulatory changes. Be precise and measured in language.`,
    manufacturing: `Manufacturing/Industrial context. Use plain, direct vocabulary. Implications relate to throughput, downtime, supply chain, labor, or operational efficiency. Avoid SaaS jargon entirely.`,
    agency: `Agency/Creative context. Implications relate to client retention, project margin, new business pipeline, or team capacity. Personality and specificity are valued.`,
  }

  const { text } = await generateText({
    model: anthropic("claude-haiku-4-5-20251001"),
    maxOutputTokens: 200,
    prompt: `You are a senior B2B sales strategist reasoning about a prospect trigger event. Your job is NOT to write an email. Your job is to identify the single most non-obvious, second-order implication of this trigger for this specific person's job.

PROSPECT:
- Name: ${fields.firstName}
- Title: ${fields.title || "unknown"}
- Company: ${fields.company}
- Trigger: ${fields.trigger}
- Trigger type: ${fields.triggerType}

SENIORITY FOCUS:
${seniorityFocus[fields.seniority]}

INDUSTRY CONTEXT:
${industryContext[fields.industryVertical]}

TRIGGER REASONING:
${triggerContext[fields.triggerType]}

Output format — write exactly 2–3 sentences:
1. The non-obvious implication (what changes for them now that most people wouldn't think to mention)
2. Why this implication is specifically relevant to their title/role at their seniority level

Do NOT write a cold email. Do NOT include a subject line. Do NOT include pleasantries. Output only the 2–3 sentence insight.`,
  })

  return text.trim()
}

function buildDraftPrompt(fields: {
  firstName: string
  lastName: string
  title: string
  company: string
  trigger: string
  triggerType: TriggerType
  insight: string
  valueProp: string
  tone: string
  length: string
  ctaStyle: string
  seniority: SeniorityLevel
  industryVertical: IndustryVertical
}): string {
  const toneInstructions: Record<string, string> = {
    conversational: "Casual, direct peer-to-peer. Fragments are fine. Lowercase subject line. No formal closings. Write like a smart colleague's Slack message.",
    professional: "Clear and confident. Full sentences preferred. Respectful but never stiff. One short paragraph max per thought.",
    formal: "Complete sentences only. No fragments. Measured pace. No contractions. This is a regulated industry — match their register.",
    bold: "Confident and direct. Short, punchy sentences. No hedging. The value prop is stated with conviction, not apology.",
    curious: "Lead with genuine curiosity about their situation. Ask or imply a question in the opening. Frame as peer-to-peer intellectual interest, not a pitch.",
  }

  const ctaExamples: Record<string, string> = {
    soft: `Use an interest-based CTA — asks the prospect to confirm or deny relevance, costs them nothing. Examples: "Worth a look?", "Is this on your radar right now?", "Is [specific problem] something ${fields.company} is dealing with?" One CTA only. End with a low-pressure out.`,
    value: `Use a value-offer CTA — the prospect gets something, which makes them reply to receive it. Examples: "Want me to send the playbook we ran for [similar company]?", "Should I send the 3-page breakdown?" One CTA only. End with a low-pressure out.`,
    question: `Use a single direct question that makes the prospect think about their situation. The question should surface a tension they haven't resolved. Examples: "Is your outbound motion scaling with the team, or is research the bottleneck?" One question. No multiple asks.`,
    calendar: `Soft open-meeting request — no calendar links in the body. Example: "Worth 15 minutes next week?" Keep it brief. No Calendly URLs. One ask only. End with a low-pressure out.`,
  }

  const seniorityAbstraction: Record<string, string> = {
    c_suite: `SENIORITY — C-SUITE: This is a ${fields.title}. Write at the highest level of abstraction. Lead with strategic framing: board narrative, competitive position, valuation, the next 18-month horizon. Do NOT mention team workflows, individual rep productivity, or operational specifics. Use peer social proof referencing other CEOs/CROs/CTOs. Never list features. One strategic outcome only.`,
    vp: `SENIORITY — VP: This is a VP-level leader who owns a function and has to scale it. Lead with operational framing: hiring and ramp pressure, quota and coverage, systems that break under growth. Strategic enough to feel relevant, operational enough to feel specific. Avoid C-level abstraction (board decks) and IC-level detail (individual workflows).`,
    director: `SENIORITY — DIRECTOR: This is a Director focused on delivering the team's number. Lead with practical framing: a specific process problem, a team execution challenge, something that makes the next quarter easier. Outcome-oriented. More specific than VP-level. Less abstract than C-suite.`,
    manager_ic: `SENIORITY — MANAGER/IC: This person cares about their day-to-day. Be specific and tactical. How does this save time, reduce friction, or solve a concrete workflow problem? Technical detail is fine. Peer-to-peer tone.`,
  }

  const industryToneRules: Record<string, string> = {
    tech_saas: "Tech/SaaS: Maximum informality is allowed and often preferred. Fragments fine. Lowercase subject. Conversational register. GTM vocabulary expected.",
    fintech_finance: "Fintech/Finance: Precise language. Slightly more formal than tech defaults. Full sentences preferred. Specific with numbers. No buzzwords.",
    healthcare: "Healthcare: Formal register. Full sentences. Be careful with outcome claims — avoid overpromising. Reference compliance and workflow context. No humor.",
    legal: "Legal: Most formal register. Complete sentences. No contractions in extreme formal cases. Full titles. Precise and measured. No jargon, no SaaS terms.",
    manufacturing: "Manufacturing/Industrial: Plain-spoken and direct. No SaaS vocabulary. Use: system, tool, process, throughput, downtime. No 'leverage', 'synergy', 'platform'.",
    agency: "Agency/Creative: Informal, personality rewarded. Specific is better than generic. These buyers spot templates immediately. Voice and distinctiveness matter.",
  }

  const triggerOpeningGuide: Record<string, string> = {
    promotion: `OPENING STRUCTURE FOR PROMOTIONS: Do NOT say "congratulations." Instead, acknowledge the transition and frame the specific challenge that comes with this exact role. Reference their previous situation if known. Pattern: "Saw you stepped into [role] at [company] — [what makes this transition specifically hard or different]."`,
    funding: `OPENING STRUCTURE FOR FUNDING: Do NOT say "congrats on the round." Skip the celebration and go directly to the operational consequence. Name specific details from the trigger if available (round size, lead investor, stage). Pattern: "The [round details] means [what the board now expects / what pressure this creates for their specific role]."`,
    content: `OPENING STRUCTURE FOR CONTENT: Reference the specific argument they made, not the platform or show. Do not summarize their content back to them. Build on their argument or extend it. Pattern: "Your [specific argument from the content] connects to something we've seen at [similar companies] — [related insight]."`,
    job_change: `OPENING STRUCTURE FOR JOB CHANGES: Reference where they came from. Name the universal phase they're in right now (first 60-90 days, auditing the stack, building opinions). Do not say "congrats on the new role." Pattern: "Saw you joined [company] — coming from [previous company], you're probably [in the specific phase they're navigating]."`,
    other: `OPENING STRUCTURE FOR OTHER TRIGGERS: Start with the specific observable fact from the trigger, then pivot immediately to what it implies for their work. Never generic.`,
  }

  const lengthTarget: Record<string, string> = {
    short: "HARD CAP: 50–75 words total for the body. Under 5 lines. Cut everything that isn't essential.",
    medium: "HARD CAP: 75–100 words total for the body. Under 6 lines. Ruthlessly remove anything that doesn't earn its place.",
    long: "HARD CAP: 100–125 words total for the body. This is the absolute maximum. Never exceed 125 words.",
  }

  return `You are an elite cold email writer who produces emails that read like they were written by a human who spent 30 minutes thinking about this one person, not an AI processing a list of 5,000.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROSPECT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${fields.firstName} ${fields.lastName}
Title: ${fields.title || "unknown"}
Company: ${fields.company}
Trigger: ${fields.trigger}
Value proposition: ${fields.valueProp || "not specified"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THE INSIGHT (USE THIS — do not ignore it)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
A senior strategist has already reasoned about this trigger and identified the non-obvious implication:

${fields.insight}

Your email MUST be built around this insight, not around the trigger itself. The opening line should make the prospect feel like someone actually thought about what this trigger means for them — not just that someone noticed the trigger happened.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TRIGGER-SPECIFIC OPENING RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${triggerOpeningGuide[fields.triggerType]}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HARD CRAFT RULES — EVERY RULE IS MANDATORY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LENGTH: ${lengthTarget[fields.length] || lengthTarget.medium}

STRUCTURE (5 lines max):
  Line 1: Trigger-based opening built from the insight — specific, no generic congrats
  Lines 2–3: Value proposition — what it is, who it's for, one specific outcome from a similar company (not a feature list)
  Line 4: CTA (see CTA rules below)
  Line 5: Low-pressure out — "Either way, appreciate the read." or similar

PERSONALIZATION RATIO:
  For every sentence about yourself or your product, write two sentences about the prospect or their situation.
  Count before you submit. I/my to you/your target: 1:2 or better.

CTA RULES:
  ${ctaExamples[fields.ctaStyle] || ctaExamples.soft}
  — ONE CTA only. Never two.
  — No calendar links, no Calendly URLs in the email body.
  — Personalize the CTA to their specific situation when possible.
  — End with a low-pressure out after the CTA.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${seniorityAbstraction[fields.seniority]}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INDUSTRY TONE RULES:
${industryToneRules[fields.industryVertical]}

BASE TONE SETTING: ${toneInstructions[fields.tone] || toneInstructions.conversational}
(If industry rules conflict with base tone, industry rules win — a legal prospect always gets formal even if the user selected conversational.)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ABSOLUTE PROHIBITIONS — NEVER INCLUDE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✗ "I hope this email finds you well" or any variant
✗ "Just wanted to reach out" or "I'm reaching out because"
✗ "My name is X and I'm the [role] at [company]"
✗ "Congratulations on" anything — acknowledge, don't celebrate
✗ Pitching language in the body: "best-in-class", "AI-powered", "leveraging", "synergy", "holistic", "seamless", "robust", "cutting-edge"
✗ ROI claims or percentage promises ("3x your pipeline", "increase revenue by 40%")
✗ More than one exclamation point in the entire email (zero is better)
✗ Emojis
✗ Links of any kind in the body (calendar links belong in signature only)
✗ Multiple CTAs
✗ "I know you're busy but"
✗ "Quick question" used dishonestly (when the email is actually a pitch)
✗ Any sentence beginning with "I" — restructure to open with "you" or the prospect's context

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COLLEAGUE TEST — APPLY BEFORE FINALIZING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Read the email aloud. Would this sound normal coming from a smart coworker in an internal Slack message? If it sounds like marketing copy, rewrite it. Boring beats clever. A peer note beats a pitch.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUBJECT LINE RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1–4 words. Colleague-message style, not newsletter style.
Good: "quick question", "re: the [topic]", "[first name]", "[company] + [your company]"
Bad: "Unlock Your Q4 Revenue Potential", "AI-Powered Cold Email Strategy for [Company]"
Lowercase is fine and often better for tech/SaaS.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT FORMAT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Output exactly this format — nothing else:

Subject: [1–4 word subject line]

[email body — no salutation prefix like "Hi Sarah," unless the tone setting requires it. No closing signature like "Best," or "Thanks," — just the body ending naturally with the low-pressure out]`
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firstName, company, trigger } = body

    if (!firstName || typeof firstName !== "string" || !firstName.trim()) {
      return Response.json({ error: "First name is required." }, { status: 400 })
    }
    if (!company || typeof company !== "string" || !company.trim()) {
      return Response.json({ error: "Company is required." }, { status: 400 })
    }
    if (!trigger || typeof trigger !== "string" || !trigger.trim()) {
      return Response.json({ error: "Trigger is required." }, { status: 400 })
    }

    const fields = {
      firstName: firstName.trim(),
      lastName: (body.lastName || "").trim(),
      title: (body.title || "").trim(),
      company: company.trim(),
      linkedinUrl: (body.linkedinUrl || "").trim(),
      trigger: trigger.trim(),
      valueProp: (body.valueProp || "").trim(),
      tone: (body.tone || "conversational").trim(),
      length: (body.length || "medium").trim(),
      ctaStyle: (body.ctaStyle || "soft").trim(),
    }

    // Read optional industry from request body; default to "tech_saas"
    const industryRaw = (body.industry || "tech_saas").toLowerCase()

    // Stage 1: classify the trigger type
    const triggerType = classifyTrigger(fields.trigger)
    const seniority = classifySeniority(fields.title)
    const industryVertical = classifyIndustry(industryRaw)

    // Stage 2: generate a non-obvious insight from the trigger before drafting
    const insight = await generateInsight({
      firstName: fields.firstName,
      title: fields.title,
      company: fields.company,
      trigger: fields.trigger,
      triggerType,
      seniority,
      industryVertical,
    })

    // Stage 3: draft the email using the insight + hard craft rules
    const { text } = await generateText({
      model: anthropic("claude-sonnet-4-6"),
      maxOutputTokens: 400,
      prompt: buildDraftPrompt({ ...fields, triggerType, insight, seniority, industryVertical }),
    })

    const subjectMatch = text.match(/^Subject:\s*(.+)/m)
    const subject = subjectMatch ? subjectMatch[1].trim() : ""
    const email = text
      .replace(/^Subject:\s*.+\n*/m, "")
      .trim()

    const persResult = computePersonalizationScore({
      body: email,
      subject,
      firstName: fields.firstName,
      company: fields.company,
      trigger: fields.trigger,
    })

    const spamResult = computeSpamScore({ subject, body: email })

    const { userId } = await auth()
    if (userId) {
      await db.insert(emails).values({
        userId,
        subject,
        body: email,
        recipientName: `${fields.firstName} ${fields.lastName}`.trim(),
        recipientCompany: fields.company,
        recipientTitle: fields.title || null,
        linkedinUrl: fields.linkedinUrl || null,
        triggerContext: fields.trigger || null,
        valueProp: fields.valueProp || null,
        tone: fields.tone || null,
        score: persResult.score,
        status: "sent",
      })
    }

    return Response.json({
      subject,
      email,
      score: persResult.score,
      scoreBreakdown: persResult.breakdown,
      spamScore: spamResult.score,
      spamFlags: spamResult.flags,
      spamIsClean: spamResult.isClean,
    })
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "An unexpected error occurred." },
      { status: 500 }
    )
  }
}
