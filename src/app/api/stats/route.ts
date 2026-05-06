// ── FILE: src/app/api/stats/route.ts ──
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { emails } from '@/lib/db/schema'
import { eq, count, gte, and } from 'drizzle-orm'

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return Response.json({ emailsTotal: 0, emailsThisMonth: 0 })
    }

    const thisMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)

    const [totalRows, monthRows] = await Promise.all([
      db.select({ count: count() }).from(emails).where(eq(emails.userId, userId)),
      db.select({ count: count() }).from(emails).where(and(eq(emails.userId, userId), gte(emails.createdAt, thisMonthStart))),
    ])

    return Response.json({
      emailsTotal: totalRows[0]?.count ?? 0,
      emailsThisMonth: monthRows[0]?.count ?? 0,
    })
  } catch {
    return Response.json({ emailsTotal: 0, emailsThisMonth: 0 })
  }
}
