import { TopBar } from "@/components/layout/top-bar"
import {
  Mail,
  TrendingUp,
  Users,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  BarChart3,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

const stats = [
  {
    label: "Emails Sent",
    value: "1,247",
    change: "+12%",
    positive: true,
    icon: Mail,
    color: "#5e6ad2",
    bg: "rgba(94,106,210,0.12)",
    sub: "vs last month",
  },
  {
    label: "Reply Rate",
    value: "34.2%",
    change: "+5.1pp",
    positive: true,
    icon: TrendingUp,
    color: "#27a644",
    bg: "rgba(39,166,68,0.12)",
    sub: "industry avg: 8%",
  },
  {
    label: "Prospects Enriched",
    value: "318",
    change: "+47",
    positive: true,
    icon: Users,
    color: "#ff801f",
    bg: "rgba(255,128,31,0.12)",
    sub: "this month",
  },
  {
    label: "Meetings Booked",
    value: "28",
    change: "+8",
    positive: true,
    icon: Calendar,
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.12)",
    sub: "this month",
  },
]

const recentEmails = [
  {
    to: "Sarah Chen",
    company: "Acme Corp",
    subject: "Congrats on the VP promotion 🎉",
    status: "replied",
    time: "2h ago",
    score: 92,
  },
  {
    to: "Marcus Williams",
    company: "TechFlow",
    subject: "Saw TechFlow's Series B — congrats",
    status: "opened",
    time: "4h ago",
    score: 88,
  },
  {
    to: "Priya Patel",
    company: "Scale.ai",
    subject: "Your post on outbound resonated",
    status: "sent",
    time: "6h ago",
    score: 85,
  },
  {
    to: "James Rivera",
    company: "Notion",
    subject: "Loved your talk at SaaStr",
    status: "replied",
    time: "1d ago",
    score: 94,
  },
  {
    to: "Amy Torres",
    company: "Stripe",
    subject: "Re: your recent hire in RevOps",
    status: "bounced",
    time: "1d ago",
    score: 76,
  },
]

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
  { label: "View Analytics", href: "/analytics", icon: BarChart3, color: "#27a644", bg: "rgba(39,166,68,0.12)" },
]

export default function DashboardPage() {
  return (
    <div>
      <TopBar
        title="Dashboard"
        description="Welcome back, James. Here's your pipeline."
      />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label}>
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="size-9 rounded-lg flex items-center justify-center"
                      style={{ background: stat.bg }}
                    >
                      <Icon className="size-4" style={{ color: stat.color }} />
                    </div>
                    <div className={`flex items-center gap-0.5 text-xs font-medium ${stat.positive ? "text-[#27a644]" : "text-[#ef4444]"}`}>
                      {stat.positive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                      {stat.change}
                    </div>
                  </div>
                  <div className="text-2xl font-bold tracking-tight text-[#f7f8f8] mb-0.5">{stat.value}</div>
                  <div className="text-xs text-[#62666d]">{stat.label}</div>
                  <div className="text-[10px] text-[#62666d] mt-0.5">{stat.sub}</div>
                </CardContent>
              </Card>
            )
          })}
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
              <div className="space-y-1">
                {recentEmails.map((email, i) => {
                  const status = statusStyles[email.status]
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-[#141516] transition-colors cursor-pointer group"
                    >
                      <div className="size-8 rounded-full bg-gradient-to-br from-[#5e6ad2]/30 to-[#a78bfa]/30 border border-[#23252a] flex items-center justify-center text-xs font-medium text-[#828fff] shrink-0">
                        {email.to.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-[#d0d6e0] truncate">{email.to}</span>
                          <span className="text-xs text-[#62666d]">· {email.company}</span>
                        </div>
                        <div className="text-xs text-[#8a8f98] truncate mt-0.5">{email.subject}</div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center gap-1">
                          <Sparkles className="size-3 text-[#62666d]" />
                          <span className="text-xs text-[#62666d]">{email.score}</span>
                        </div>
                        <Badge variant={status.variant} className="text-[10px] h-4 py-0">{status.label}</Badge>
                        <span className="text-[10px] text-[#62666d]">{email.time}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
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

            {/* Monthly Goal */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Monthly Goal</CardTitle>
                <CardDescription className="text-xs">50 meetings booked</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#8a8f98]">28 / 50 meetings</span>
                  <span className="font-semibold text-[#f7f8f8]">56%</span>
                </div>
                <Progress value={56} />
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {[
                    { label: "On track", value: "12d left", color: "#27a644" },
                    { label: "Needed/day", value: "1.5", color: "#f59e0b" },
                    { label: "Streak", value: "7 days", color: "#5e6ad2" },
                  ].map((item) => (
                    <div key={item.label} className="text-center">
                      <div className="text-sm font-semibold" style={{ color: item.color }}>{item.value}</div>
                      <div className="text-[10px] text-[#62666d] mt-0.5">{item.label}</div>
                    </div>
                  ))}
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
                      Your Tuesday morning emails have a 42% reply rate — 23% higher than your average. Try scheduling more sends at 8–9am Tues.
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
