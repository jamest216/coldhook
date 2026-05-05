"use client"

import { useState } from "react"
import { TopBar } from "@/components/layout/top-bar"
import {
  Search,
  Filter,
  Upload,
  Plus,
  ExternalLink,
  MoreHorizontal,
  Sparkles,
  TrendingUp,
  Building2,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

const prospects = [
  {
    id: 1,
    name: "Sarah Chen",
    title: "VP of Sales",
    company: "Acme Corp",
    industry: "SaaS",
    score: 92,
    trigger: "Just promoted",
    status: "hot",
    enriched: true,
    emails: 2,
    lastActivity: "2h ago",
  },
  {
    id: 2,
    name: "Marcus Williams",
    title: "Head of Revenue",
    company: "TechFlow",
    industry: "Fintech",
    score: 88,
    trigger: "Series B raised",
    status: "warm",
    enriched: true,
    emails: 1,
    lastActivity: "4h ago",
  },
  {
    id: 3,
    name: "Priya Patel",
    title: "Director of Sales",
    company: "Scale.ai",
    industry: "AI/ML",
    score: 85,
    trigger: "Hiring 5 AEs",
    status: "warm",
    enriched: true,
    emails: 0,
    lastActivity: "1d ago",
  },
  {
    id: 4,
    name: "James Rivera",
    title: "CRO",
    company: "Notion",
    industry: "Productivity",
    score: 79,
    trigger: "New hire in RevOps",
    status: "cool",
    enriched: false,
    emails: 1,
    lastActivity: "2d ago",
  },
  {
    id: 5,
    name: "Amy Torres",
    title: "VP Revenue Operations",
    company: "Stripe",
    industry: "Payments",
    score: 76,
    trigger: "Conference speaker",
    status: "cool",
    enriched: true,
    emails: 3,
    lastActivity: "3d ago",
  },
  {
    id: 6,
    name: "David Kim",
    title: "SVP Sales",
    company: "Figma",
    industry: "Design",
    score: 94,
    trigger: "Product launch",
    status: "hot",
    enriched: true,
    emails: 0,
    lastActivity: "Just added",
  },
]

const statusConfig: Record<string, { label: string; variant: "success" | "warning" | "secondary" }> = {
  hot: { label: "Hot", variant: "success" },
  warm: { label: "Warm", variant: "warning" },
  cool: { label: "Cool", variant: "secondary" },
}

export default function ProspectsPage() {
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<number[]>([])

  const filtered = prospects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.company.toLowerCase().includes(search.toLowerCase()) ||
      p.title.toLowerCase().includes(search.toLowerCase())
  )

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  return (
    <div>
      <TopBar
        title="Prospects"
        description={`${prospects.length} prospects in your pipeline`}
        action={
          <Button variant="secondary" size="sm" className="h-7 text-xs gap-1.5">
            <Upload className="size-3" />
            Import CSV
          </Button>
        }
      />

      <div className="p-6 space-y-4">
        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Prospects", value: "318", color: "#5e6ad2" },
            { label: "Hot Leads", value: "47", color: "#ef4444" },
            { label: "Awaiting Email", value: "83", color: "#f59e0b" },
            { label: "Enrichment Queue", value: "12", color: "#27a644" },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="pt-3 pb-3 flex items-center justify-between">
                <span className="text-xs text-[#8a8f98]">{s.label}</span>
                <span className="text-xl font-bold" style={{ color: s.color }}>{s.value}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table controls */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-[#62666d]" />
            <Input
              placeholder="Search prospects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-xs"
            />
          </div>
          <Button variant="secondary" size="sm" className="h-8 text-xs gap-1.5">
            <Filter className="size-3" />
            Filter
            <ChevronDown className="size-3" />
          </Button>
          {selected.length > 0 && (
            <div className="flex items-center gap-2 ml-2">
              <span className="text-xs text-[#8a8f98]">{selected.length} selected</span>
              <Button variant="default" size="sm" className="h-7 text-xs gap-1.5">
                <Sparkles className="size-3" />
                Generate emails
              </Button>
            </div>
          )}
          <div className="ml-auto">
            <Button variant="default" size="sm" className="h-8 text-xs gap-1.5">
              <Plus className="size-3" />
              Add prospect
            </Button>
          </div>
        </div>

        {/* Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#23252a]">
                  <th className="text-left px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-[#62666d]">
                    <input
                      type="checkbox"
                      className="rounded border-[#23252a] bg-[#141516] accent-[#5e6ad2]"
                      onChange={(e) =>
                        setSelected(e.target.checked ? prospects.map((p) => p.id) : [])
                      }
                    />
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-[#62666d]">Prospect</th>
                  <th className="text-left px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-[#62666d]">Company</th>
                  <th className="text-left px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-[#62666d]">Signal</th>
                  <th className="text-left px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-[#62666d]">Score</th>
                  <th className="text-left px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-[#62666d]">Status</th>
                  <th className="text-left px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-[#62666d]">Emails</th>
                  <th className="text-right px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-[#62666d]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1b1f]">
                {filtered.map((p) => {
                  const statusC = statusConfig[p.status]
                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-[#141516] transition-colors ${selected.includes(p.id) ? "bg-[rgba(94,106,210,0.05)]" : ""}`}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          className="rounded border-[#23252a] bg-[#141516] accent-[#5e6ad2]"
                          checked={selected.includes(p.id)}
                          onChange={() => toggleSelect(p.id)}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-full bg-gradient-to-br from-[#5e6ad2]/30 to-[#a78bfa]/30 border border-[#23252a] flex items-center justify-center text-xs font-medium text-[#828fff] shrink-0">
                            {p.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-[#f7f8f8]">{p.name}</div>
                            <div className="text-xs text-[#62666d]">{p.title}</div>
                          </div>
                          {p.enriched && (
                            <ExternalLink className="size-3 text-[#0a66c2] shrink-0" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Building2 className="size-3 text-[#62666d]" />
                          <span className="text-sm text-[#d0d6e0]">{p.company}</span>
                          <Badge variant="secondary" className="text-[9px] h-3.5 py-0">{p.industry}</Badge>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <TrendingUp className="size-3 text-[#27a644]" />
                          <span className="text-xs text-[#d0d6e0]">{p.trigger}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="relative size-6">
                            <svg className="size-6 -rotate-90" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="9" fill="none" stroke="#23252a" strokeWidth="2.5" />
                              <circle
                                cx="12" cy="12" r="9"
                                fill="none"
                                stroke={p.score > 85 ? "#27a644" : p.score > 75 ? "#f59e0b" : "#ef4444"}
                                strokeWidth="2.5"
                                strokeDasharray={`${(p.score / 100) * 56.5} 56.5`}
                              />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-[#f7f8f8]">{p.score}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={statusC.variant} className="text-[10px] h-4 py-0">{statusC.label}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm text-[#8a8f98]">{p.emails}</span>
                          <span className="text-xs text-[#62666d]">sent</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon-sm" className="size-7" asChild>
                            <Link href="/compose">
                              <Sparkles className="size-3.5 text-[#5e6ad2]" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon-sm" className="size-7">
                            <MoreHorizontal className="size-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
