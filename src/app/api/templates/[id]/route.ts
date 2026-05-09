import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { templates } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"

type Ctx = { params: Promise<{ id: string }> }

export async function PUT(req: Request, { params }: Ctx) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  const [updated] = await db
    .update(templates)
    .set({ ...body, updatedAt: new Date() })
    .where(and(eq(templates.id, id), eq(templates.userId, userId)))
    .returning()
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(updated)
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  await db.delete(templates)
    .where(and(eq(templates.id, id), eq(templates.userId, userId)))
  return NextResponse.json({ success: true })
}

export async function POST(req: Request, { params }: Ctx) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const url = new URL(req.url)
  if (url.searchParams.get("action") !== "duplicate") {
    return NextResponse.json({ error: "Unknown action" }, { status: 400 })
  }
  const [original] = await db.select().from(templates)
    .where(and(eq(templates.id, id), eq(templates.userId, userId)))
    .limit(1)
  if (!original) return NextResponse.json({ error: "Not found" }, { status: 404 })
  const { id: _id, createdAt: _c, updatedAt: _u, uses: _uses, ...rest } = original
  const [copy] = await db.insert(templates).values({
    ...rest,
    name: `${original.name} (copy)`,
    uses: 0,
  }).returning()
  return NextResponse.json(copy, { status: 201 })
}
