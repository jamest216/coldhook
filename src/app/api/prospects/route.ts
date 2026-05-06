// ── FILE: src/app/api/prospects/route.ts ──
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { prospects } from '@/lib/db/schema'
import { eq, count, and, desc } from 'drizzle-orm'

const emptyResponse = { prospects: [], stats: { total: 0, hot: 0, awaitingEmail: 0 } }

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return Response.json(emptyResponse)

    const [rows, hotRows, awaitingRows] = await Promise.all([
      db.select().from(prospects).where(eq(prospects.userId, userId)).orderBy(desc(prospects.createdAt)),
      db.select({ count: count() }).from(prospects).where(and(eq(prospects.userId, userId), eq(prospects.status, 'hot'))),
      db.select({ count: count() }).from(prospects).where(and(eq(prospects.userId, userId), eq(prospects.emailsSent, 0))),
    ])

    return Response.json({
      prospects: rows,
      stats: {
        total: rows.length,
        hot: hotRows[0]?.count ?? 0,
        awaitingEmail: awaitingRows[0]?.count ?? 0,
      },
    })
  } catch {
    return Response.json(emptyResponse)
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { name, company, title, industry, linkedinUrl, triggerSignal, status } = body

    if (!name || typeof name !== 'string' || !name.trim()) {
      return Response.json({ error: 'name is required' }, { status: 400 })
    }
    if (!company || typeof company !== 'string' || !company.trim()) {
      return Response.json({ error: 'company is required' }, { status: 400 })
    }

    const [inserted] = await db
      .insert(prospects)
      .values({
        userId,
        name: name.trim(),
        company: company.trim(),
        title: title || null,
        industry: industry || null,
        linkedinUrl: linkedinUrl || null,
        triggerSignal: triggerSignal || null,
        status: status || 'warm',
        emailsSent: 0,
      })
      .returning()

    return Response.json(inserted, { status: 201 })
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
