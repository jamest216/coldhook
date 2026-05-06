import { NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { createAnthropic } from "@ai-sdk/anthropic"

const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      firstName,
      lastName,
      title,
      company,
      trigger,
      valueProp,
      tone,
      ctaStyle,
      initialEmail,
      initialSubject,
    } = body

    if (!firstName || !company || !initialEmail) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 })
    }

    const toneMap: Record<string, string> = {
      conversational: "warm and conversational",
      professional: "polished and professional",
      bold: "bold and direct",
      curious: "curious and inquisitive",
    }

    const ctaMap: Record<string, string> = {
      soft: "a soft ask like '15 minutes?'",
      calendar: "a calendar link offer",
      question: "an open-ended question",
      bold: "a bold direct ask like 'demo this week?'",
    }

    const systemPrompt = `You are an elite B2B sales copywriter. You write follow-up cold emails that feel genuinely human, not automated. Your emails are short, add real value, and never feel pushy. You already sent an initial email — now you're writing the follow-ups in a 3-email sequence.`

    const contextBlock = `
PROSPECT: ${firstName}${lastName ? " " + lastName : ""}, ${title ?? "unknown title"} at ${company}
TRIGGER / BUYING SIGNAL: ${trigger ?? "N/A"}
VALUE PROP: ${valueProp ?? "N/A"}
TONE: ${toneMap[tone] ?? tone}
CTA STYLE: ${ctaMap[ctaStyle] ?? ctaStyle}

INITIAL EMAIL ALREADY SENT:
Subject: ${initialSubject}
${initialEmail}
`

    const day3Prompt = `${contextBlock}

Write a Day 3 follow-up email. This is a value-add follow-up — provide something genuinely useful (a stat, a brief insight, a relevant resource reference, or a quick observation) that builds on why you reached out. Don't just "bump" the first email. Be brief (under 60 words). End with ${ctaMap[ctaStyle] ?? "a soft ask"}.

Return ONLY valid JSON in this exact format, no markdown, no explanation:
{"subject": "...", "email": "..."}`

    const day7Prompt = `${contextBlock}

Write a Day 7 breakup email. This is the final email in the sequence. Keep it under 50 words. Be honest that this is your last follow-up. Give ${firstName} a graceful out while leaving the door open. No guilt-tripping — just class.

Return ONLY valid JSON in this exact format, no markdown, no explanation:
{"subject": "...", "email": "..."}`

    const [day3Result, day7Result] = await Promise.all([
      generateText({
        model: anthropic("claude-haiku-4-5-20251001"),
        system: systemPrompt,
        prompt: day3Prompt,
        maxOutputTokens: 400,
      }),
      generateText({
        model: anthropic("claude-haiku-4-5-20251001"),
        system: systemPrompt,
        prompt: day7Prompt,
        maxOutputTokens: 400,
      }),
    ])

    const parseEmail = (raw: string) => {
      const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()
      return JSON.parse(cleaned) as { subject: string; email: string }
    }

    const day3 = parseEmail(day3Result.text)
    const day7 = parseEmail(day7Result.text)

    return NextResponse.json({ day3, day7 })
  } catch (err) {
    console.error("[generate-sequence] error:", err)
    return NextResponse.json({ error: "Failed to generate sequence." }, { status: 500 })
  }
}
