import { TopBar } from "@/components/layout/top-bar"
import {
  Mail,
  TrendingUp,
  Users,
  Calendar,
  ArrowUpRight,
  Sparkles,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { auth, currentUser } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { emails, prospects } from "@/lib/db/schema"
import { eq, desc, count, gte, and } from "drizzle-orm"

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

const statusStyles: Record<string, { label: string; variant: "success" | "warning" | "secondary" | "error" | "default" }> = {
  replied: { label: "Replied", variant: "success" },
  opened: { label: "Opened", variant: "warning" },
  sent: { label: "Sent", variant: "secondary" },
  bounced: { label: "Bounced", variant: "error" },
}

const quickActions = [
  { label: "Compose with AI", href: "/compose", icon: Sparkles, color: "#5e6ad2", bg: "rgba(94,106,210,0.12)" },
  { label: "Import Prospects", href: "/prospects", icon: Users, color: "#ff801f", bg: "rgba(255,128,31,0.12)" },
  { label: "Browse Templates", href: "/templates", icon: Mail, color: "#a78bfa", bg: "rgba(167,139,250,0.12)" },
]

export default async function DashboardPage() {
  const [{ userId }, clerkUser] = await Promise.all([auth(), currentUser()])

  const thisMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)

  const [recentEmailRows, totalCountRows, thisMonthCountRows, repliedCountRows, prospectsThisMonthRows] = await Promise.all([
    db.select().from(emails)
      .where(eq(emails.userId, userId!))
      .orderBy(desc(emails.createdAt))
      .limit(5),
    db.select({ count: count() }).from(emails)
      .where(eq(emails.userId, userId!)),
    db.select({ count: count() }).from(emails)
      .where(and(eq(emails.userId, userId!), gte(emails.createdAt, thisMonthStart))),
    db.select({ count: count() }).from(emails)
      .where(and(eq(emails.userId, userId!), eq(emails.status, "replied"))),
    db.select({ count: count() }).from(prospects)
      .where(and(eq(prospects.userId, userId!), gte(prospects.createdAt, thisMonthStart))),
  ])

  const totalEmails = totalCountRows[0]?.count ?? 0
  const thisMonthEmails = thisMonthCountRows[0]?.count ?? 0
  const repliedCount = repliedCountRows[0]?.count ?? 0
  const replyRate = totalEmails > 0 ? ((repliedCount / totalEmails) * 100).toFixed(1) : null
  const prospectsThisMonth = prospectsThisMonthRows[0]?.count ?? 0
  const hasEmails = recentEmailRows.length > 0

  return (
    <div>
      <TopBar
        title="Dashboard"
        description={`Welcome back${clerkUser?.firstName ? `, ${clerkUser.firstName}` : ""}. Here's your pipeline.`}
      />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Emails Sent */}
          <Card>
            <CardContent className="pt-5">
              <div className="flex items-start justify-between mb-3">
                <div className="size-9 rounded-lg flex items-center justify-center" style={{ background: "rgba(94,106,210,0.12)" }}>
                  <Mail className="size-4" style={{ color: "#5e6ad2" }} />
                </div>
                <div className={`flex items-center gap-0.5 text-xs font-medium ${thisMonthEmails > 0 ? "text-[#27a644]" : "text-[#62666d]"}`}>
                  {thisMonthEmails > 0 ? <ArrowUpRight className="size-3" /> : null}
                  {thisMonthEmails > 0 ? `+${thisMonthEmails} this month` : "No emails yet"}
                </div>
              </div>
              <div className="text-2xl font-bold tracking-tight text-[#f7f8f8] mb-0.5">{totalEmails.toLocaleString()}</div>
              <div className="text-xs text-[#62666d]">Emails Sent</div>
              <div className="text-[10px] text-[#62666d] mt-0.5">all time</div>
            </CardContent>
          </Card>

          {/* Reply Rate */}
          <Card>
            <CardContent className="pt-5">
              <div className="flex items-start justify-between mb-3">
                <div className="size-9 rounded-lg flex items-center justify-center" style={{ background: "rgba(39,166,68,0.12)" }}>
                  <TrendingUp className="size-4" style={{ color: "#27a644" }} />
                </div>
                {replyRate !== null ? (
                  <div className="flex items-center gap-0.5 text-xs font-medium text-[#27a644]">
                    <ArrowUpRight className="size-3" />
                    vs 8% avg
                  </div>
                ) : (
                  <div className="text-xs text-[#62666d]">no data yet</div>
                )}
              </div>
              <div className="text-2xl font-bold tracking-tight text-[#f7f8f8] mb-0.5">
                {replyRate !== null ? `${replyRate}%` : "—"}
              </div>
              <div className="text-xs text-[#62666d]">Reply Rate</div>
              <div className="text-[10px] text-[#62666d] mt-0.5">
                {replyRate !== null ? `${repliedCount} of ${totalEmails} replied` : "send emails to track"}
              </div>
            </CardContent>
          </Card>

          {/* Prospects Added */}
          <Card>
            <CardContent className="pt-5">
              <div className="flex items-start justify-between mb-3">
                <div className="size-9 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,128,31,0.12)" }}>
                  <Users className="size-4" style={{ color: "#ff801f" }} />
                </div>
                {prospectsThisMonth > 0 ? (
                  <div className="flex items-center gap-0.5 text-xs font-medium text-[#27a644]">
                    <ArrowUpRight className="size-3" />
                    +{prospectsThisMonth} this month
                  </div>
                ) : (
                  <div className="text-xs text-[#62666d]">no data yet</div>
                )}
              </div>
              <div className="text-2xl font-bold tracking-tight text-[#f7f8f8] mb-0.5">{prospectsThisMonth}</div>
              <div className="text-xs text-[#62666d]">Prospects Added</div>
              <div className="text-[10px] text-[#62666d] mt-0.5">this month</div>
            </CardContent>
          </Card>

          {/* Meetings Booked */}
          <Card>
            <CardContent className="pt-5">
              <div className="flex items-start justify-between mb-3">
                <div className="size-9 rounded-lg flex items-center justify-center" style={{ background: "rgba(167,139,250,0.12)" }}>
                  <Calendar className="size-4" style={{ color: "#a78bfa" }} />
                </div>
                <div className="text-xs text-[#62666d]">coming soon</div>
              </div>
              <div className="text-2xl font-bold tracking-tight text-[#f7f8f8] mb-0.5">—</div>
              <div className="text-xs text-[#62666d]">Meetings Booked</div>
              <div className="text-[10px] text-[#62666d] mt-0.5">calendar sync needed</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent Emails */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm">Recent Emails</CardTitle>
                  <CardDescription className="text-xs mt-0.5">Your latest personalized outreach</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-xs h-7" asChild>
                  <Link href="/compose">View all</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {!hasEmails ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="size-10 rounded-xl bg-[rgba(94,106,210,0.08)] border border-[rgba(94,106,210,0.15)] flex items-center justify-center mb-3">
                    <Sparkles className="size-5 text-[#5e6ad2]" />
                  </div>
                  <p className="text-sm text-[#8a8f98] mb-1">No emails yet</p>
                  <p className="text-xs text-[#62666d] mb-4">Generate your first personalized email to see it here.</p>
                  <Button size="sm" className="h-7 text-xs gap-1.5" asChild>
                    <Link href="/compose"><Sparkles className="size-3" />Generate first email</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-1">
                  {recentEmailRows.map((email) => {
                    const statusKey = email.status ?? "sent"
                    const status = statusStyles[statusKey] ?? statusStyles.sent
                    return (
                      <div
                        key={email.id}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-[#141516] transition-colors cursor-pointer group"
                      >
                        <div className="size-8 rounded-full bg-gradient-to-br from-[#5e6ad2]/30 to-[#a78bfa]/30 border border-[#23252a] flex items-center justify-center text-xs font-medium text-[#828fff] shrink-0">
                          {email.recipientName.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-[#d0d6e0] truncate">{email.recipientName}</span>
                            <span className="text-xs text-[#62666d]">· {email.recipientCompany}</span>
                          </div>
                          <div className="text-xs text-[#8a8f98] truncate mt-0.5">{email.subject}</div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex items-center gap-1">
                            <Sparkles className="size-3 text-[#62666d]" />
                            <span className="text-xs text-[#62666d]">{email.score ?? "—"}</span>
                          </div>
                          <Badge variant={status.variant} className="text-[10px] h-4 py-0">{status.label}</Badge>
                          <span className="text-[10px] text-[#62666d]">{timeAgo(email.createdAt)}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right column */}
          <div className="space-y-4">
            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action) => {
                    const Icon = action.icon
                    return (
                      <Link
                        key={action.label}
                        href={action.href}
                        className="flex flex-col items-center gap-2 rounded-lg border border-[#23252a] p-3 hover:border-[#34343a] hover:bg-[#141516] transition-all text-center group"
                      >
                        <div
                          className="size-8 rounded-lg flex items-center justify-center"
                          style={{ background: action.bg }}
                        >
                          <Icon className="size-4" style={{ color: action.color }} />
                        </div>
                        <span className="text-xs text-[#8a8f98] group-hover:text-[#d0d6e0] leading-tight">{action.label}</span>
                      </Link>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Meeting tracking placeholder */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Meeting Tracking</CardTitle>
                <CardDescription className="text-xs">Coming soon</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-4 text-center gap-2">
                  <Calendar className="size-8 text-[#34343a]" />
                  <p className="text-xs text-[#62666d] leading-relaxed">
                    Connect your calendar to auto-log booked meetings and track your monthly goal.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* AI Tips */}
            <Card className="border-[rgba(94,106,210,0.25)] bg-[rgba(94,106,210,0.05)]">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start gap-3">
                  <div className="size-8 rounded-lg bg-[rgba(94,106,210,0.15)] border border-[rgba(94,106,210,0.2)] flex items-center justify-center shrink-0">
                    <Sparkles className="size-4 text-[#5e6ad2]" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#828fff] mb-1">AI Insight</p>
                    <p className="text-xs text-[#8a8f98] leading-relaxed">
                      Send more emails to unlock AI insights about your best-performing times and templates.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
