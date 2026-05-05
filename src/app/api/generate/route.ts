import { anthropic } from "@ai-sdk/anthropic"
import { generateText } from "ai"

function buildPrompt(fields: Record<string, string>) {
  return `You are an expert cold email copywriter. Write a hyper-personalized cold email based on the prospect intelligence below.

PROSPECT:
- Name: ${fields.firstName} ${fields.lastName}
- Title: ${fields.title}
- Company: ${fields.company}
- LinkedIn: ${fields.linkedinUrl}

TRIGGER / CONTEXT:
${fields.trigger}

VALUE PROPOSITION:
${fields.valueProp}

EMAIL SETTINGS:
- Tone: ${fields.tone}
- Length: ${fields.length}
- CTA Style: ${fields.ctaStyle}

Write the email in this exact format — a subject line prefixed with "Subject:", then a blank line, then the email body:

Subject: [compelling subject line]

[email body — do not include a salutation like "Hi Sarah" or a closing like "Best" unless the tone calls for it. Follow the length setting: short is ~3 sentences, medium is ~75 words, long is ~120 words. Vary the CTA phrasing — never use the same closing structure twice. Options: ask a question, suggest a specific next step, reference their timeline, or make it even softer ("happy to send more if useful"). Match punctuation energy to the tone setting. Conversational can use light punctuation variation. Professional stays clean. Never use hashtags. Never multiple exclamation points. One max per email only if tone calls for it. Never use emojis unless the trigger describes a very casual context.]`
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

    const { text } = await generateText({
      model: anthropic("claude-sonnet-4-6"),
      prompt: buildPrompt(fields),
    })

    const subjectMatch = text.match(/^Subject:\s*(.+)/m)
    const subject = subjectMatch ? subjectMatch[1].trim() : ""
    const email = text
      .replace(/^Subject:\s*.+\n*/m, "")
      .trim()

    return Response.json({ subject, email })
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "An unexpected error occurred." },
      { status: 500 }
    )
  }
}
