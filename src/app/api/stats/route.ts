// ── FILE: src/app/api/stats/route.ts ──
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { emails, prospects } from '@/lib/db/schema'
import { eq, count, gte, and } from 'drizzle-orm'

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return Response.json({ emailsTotal: 0, emailsThisMonth: 0, replyRate: null, prospectsThisMonth: 0 })
    }

    const thisMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)

    const [totalRows, monthRows, repliedRows, prospectsMonthRows] = await Promise.all([
      db.select({ count: count() }).from(emails).where(eq(emails.userId, userId)),
      db.select({ count: count() }).from(emails).where(and(eq(emails.userId, userId), gte(emails.createdAt, thisMonthStart))),
      db.select({ count: count() }).from(emails).where(and(eq(emails.userId, userId), eq(emails.status, 'replied'))),
      db.select({ count: count() }).from(prospects).where(and(eq(prospects.userId, userId), gte(prospects.createdAt, thisMonthStart))),
    ])

    const emailsTotal = totalRows[0]?.count ?? 0
    const repliedCount = repliedRows[0]?.count ?? 0
    const replyRate = emailsTotal > 0
      ? parseFloat(((repliedCount / emailsTotal) * 100).toFixed(1))
      : null

    return Response.json({
      emailsTotal,
      emailsThisMonth: monthRows[0]?.count ?? 0,
      replyRate,
      prospectsThisMonth: prospectsMonthRows[0]?.count ?? 0,
    })
  } catch {
    return Response.json({ emailsTotal: 0, emailsThisMonth: 0, replyRate: null, prospectsThisMonth: 0 })
  }
}
