import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { templates } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const rows = await db.select().from(templates)
    .where(eq(templates.userId, userId))
    .orderBy(desc(templates.createdAt))
  return NextResponse.json(rows)
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await req.json()
  if (!body.name || !body.subject || !body.body) {
    return NextResponse.json({ error: "name, subject, and body are required" }, { status: 400 })
  }
  const [row] = await db.insert(templates).values({
    userId,
    name:        body.name,
    category:    body.category    ?? "Custom",
    description: body.description ?? null,
    subject:     body.subject,
    body:        body.body,
    tone:        body.tone        ?? "conversational",
    tags:        body.tags        ?? [],
    starred:     body.starred     ?? false,
  }).returning()
  return NextResponse.json(row, { status: 201 })
}
