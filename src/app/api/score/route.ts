import { NextRequest, NextResponse } from "next/server"

function scrubPii(
  text: string,
  firstName: string,
  lastName: string,
  company: string
): string {
  let scrubbed = text
  const fullName = `${firstName} ${lastName}`.trim()
  const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

  if (fullName.length > 0) {
    scrubbed = scrubbed.replaceAll(
      new RegExp(escape(fullName), "gi"),
      "[NAME]"
    )
  }
  if (firstName.length > 1) {
    scrubbed = scrubbed.replaceAll(
      new RegExp(`\\b${escape(firstName)}\\b`, "gi"),
      "[NAME]"
    )
  }
  if (lastName.length > 1) {
    scrubbed = scrubbed.replaceAll(
      new RegExp(`\\b${escape(lastName)}\\b`, "gi"),
      "[NAME]"
    )
  }
  if (company.length > 1) {
    scrubbed = scrubbed.replaceAll(
      new RegExp(escape(company), "gi"),
      "[COMPANY]"
    )
  }
  return scrubbed
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { error: "DeepSeek API key not configured", unavailable: true },
        { status: 200 }
      )
    }

    const body = await req.json()
    const { subject, body: emailBody, firstName, lastName, company } = body

    if (!emailBody || !subject) {
      return NextResponse.json(
        { error: "Subject and body are required." },
        { status: 400 }
      )
    }

    const scrubbedBody = scrubPii(
      emailBody,
      firstName ?? "",
      lastName ?? "",
      company ?? ""
    )
    const scrubbedSubject = scrubPii(
      subject,
      firstName ?? "",
      lastName ?? "",
      company ?? ""
    )

    const prompt = `You are an expert cold email reviewer. Analyze this cold email for effectiveness:

Subject: ${scrubbedSubject}

Body: ${scrubbedBody}

Provide a brief qualitative assessment (2-3 sentences) covering:
- Whether the hook feels personalized (not generic)
- Whether the tone matches the prospect's likely context
- One specific improvement suggestion

Note: [NAME] and [COMPANY] are placeholders for scrubbed personal information. Evaluate based on structure and tone, not the specific names.`

    const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
        temperature: 0.7,
      }),
    })

    if (!res.ok) {
      throw new Error(`DeepSeek API error: ${res.status}`)
    }

    const data = await res.json()
    const assessment =
      data.choices?.[0]?.message?.content ?? "No assessment generated."

    return NextResponse.json({ assessment })
  } catch (err) {
    console.error("[score] error:", err)
    return NextResponse.json(
      {
        assessment: null,
        error:
          "Qualitative assessment temporarily unavailable. Heuristic scores are still shown.",
      },
      { status: 200 }
    )
  }
}
