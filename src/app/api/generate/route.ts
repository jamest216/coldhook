import { anthropic } from "@ai-sdk/anthropic"
import { generateText } from "ai"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { emails } from "@/lib/db/schema"
import { computePersonalizationScore, computeSpamScore } from "@/lib/scoring"

type TriggerType = "promotion" | "funding" | "content" | "job_change" | "other"

function classifyTrigger(trigger: string): TriggerType {
  const t = trigger.toLowerCase()
  if (/\b(promot|vp |cro|cmo|cto|ceo|chief|head of|director|new role|stepped into|just became)\b/.test(t)) return "promotion"
  if (/\b(series [abcde]|seed round|raised|funding|raise|investors|led by|venture|capital)\b/.test(t)) return "funding"
  if (/\b(podcast|episode|post|article|talk|spoke|wrote|published|interview|webinar|keynote|linkedin post)\b/.test(t)) return "content"
  if (/\b(joined|just joined|started at|new job|moved to|left .+ for|now at)\b/.test(t)) return "job_change"
  return "other"
}

async function generateInsight(fields: {
  firstName: string
  title: string
  company: string
  trigger: string
  triggerType: TriggerType
}): Promise<string> {
  const triggerContext: Record<string, string> = {
    promotion: `Focus on: what specific operational and political challenges come with this exact role transition. What does this person now have to prove, build, or fix that they didn't before? What mandate do they likely have?`,
    funding: `Focus on: what the round size and stage actually mean in operational pressure — hiring timelines, board expectations, burn rate, GTM acceleration. What is the person in this seat now accountable for that they weren't before the round closed?`,
    content: `Focus on: the specific argument or perspective they expressed — what does holding that view imply about how they see their biggest problem right now? What would a peer say in response?`,
    job_change: `Focus on: the gap between where they came from and where they've landed. What expectations does their previous company set that won't match reality at the new company? What audit are they already running?`,
    other: `Focus on: what this trigger event implies is changing or under pressure in their world right now. What problem does it surface that probably wasn't urgent 3 months ago?`,
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

${triggerContext[fields.triggerType]}

Output format — write exactly 2–3 sentences:
1. The non-obvious implication (what changes for them now that most people wouldn't think to mention)
2. Why this implication is specifically relevant to their title/role (not generic — tie it to the actual job function)

Do NOT write a cold email. Do NOT include a subject line. Do NOT include pleasantries. Just output the 2–3 sentence insight that a smart colleague would think of.`,
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
}): string {
  const toneInstructions: Record<string, string> = {
    conversational: "Casual, direct peer-to-peer. Fragments are fine. Lowercase subject line. No formal closings.",
    professional: "Clear and respectful but never stiff. Full sentences. Avoid contractions only if the industry demands it.",
    formal: "Complete sentences. No fragments. Full name in greeting if one is used. No contractions.",
  }

  const ctaExamples: Record<string, string> = {
    soft: `Use an interest-based CTA. Examples: "Worth a look?", "Is this on your radar right now?", "Open to a quick walk-through?", "Is [specific problem] something ${fields.company} is dealing with right now?"`,
    value: `Use a value-offer CTA. Examples: "Want me to send the playbook we ran for [similar company]?", "Should I send over the benchmark data?", "Happy to share the 3-page breakdown — want me to send it?"`,
    direct: `Use a soft open-meeting CTA. Example: "Worth 15 minutes next week?" — do NOT include a calendar link. No Calendly links in the first email.`,
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

TONE: ${toneInstructions[fields.tone] || toneInstructions.conversational}

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

    // Stage 1: classify the trigger type
    const triggerType = classifyTrigger(fields.trigger)

    // Stage 2: generate a non-obvious insight from the trigger before drafting
    const insight = await generateInsight({
      firstName: fields.firstName,
      title: fields.title,
      company: fields.company,
      trigger: fields.trigger,
      triggerType,
    })

    // Stage 3: draft the email using the insight + hard craft rules
    const { text } = await generateText({
      model: anthropic("claude-sonnet-4-6"),
      maxOutputTokens: 400,
      prompt: buildDraftPrompt({ ...fields, triggerType, insight }),
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
