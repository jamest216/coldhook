import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { userSettings } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

const DEFAULTS = {
  senderValueProp:         null,
  senderTitle:             null,
  senderCompany:           null,
  senderLinkedinUrl:       null,
  defaultTone:             "conversational",
  defaultLength:           "medium",
  defaultCtaStyle:         "soft",
  defaultIndustry:         "tech_saas",
  includeSocialProof:      true,
  emojiInSubjects:         true,
  personalizationFromNews: true,
  spamScoreCheck:          true,
  autoAbSubjects:          false,
  notifyOnReply:           true,
  notifyWeeklySummary:     true,
  notifyBuyingSignal:      true,
  notifyAbTestWinner:      false,
  notifyMonthlyInsights:   true,
}

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const rows = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, userId))
    .limit(1)

  return NextResponse.json(rows[0] ?? { userId, ...DEFAULTS })
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json() as Record<string, unknown>

  // Strip unknown keys — only allow schema fields
  const allowed = Object.keys(DEFAULTS) as Array<keyof typeof DEFAULTS>
  const values: Record<string, unknown> = { userId, updatedAt: new Date() }
  for (const key of allowed) {
    if (key in body) values[key] = body[key]
  }

  const [updated] = await db
    .insert(userSettings)
    .values(values as typeof userSettings.$inferInsert)
    .onConflictDoUpdate({
      target: userSettings.userId,
      set: { ...values, updatedAt: new Date() } as Partial<typeof userSettings.$inferInsert>,
    })
    .returning()

  return NextResponse.json(updated)
}
