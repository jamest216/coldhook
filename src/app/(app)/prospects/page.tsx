// ── FILE: src/app/(app)/prospects/page.tsx ──
"use client"

import { useState, useEffect } from "react"
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
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

type ProspectRow = {
  id: string
  name: string
  title: string | null
  company: string
  industry: string | null
  triggerSignal: string | null
  score: number | null
  status: string
  emailsSent: number
  linkedinUrl: string | null
  createdAt: string
}

const statusConfig: Record<string, { label: string; variant: "success" | "warning" | "secondary" }> = {
  hot: { label: "Hot", variant: "success" },
  warm: { label: "Warm", variant: "warning" },
  cool: { label: "Cool", variant: "secondary" },
}

const defaultAddForm = { name: "", company: "", title: "", industry: "", triggerSignal: "", status: "warm" }

export default function ProspectsPage() {
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<string[]>([])
  const [prospectRows, setProspectRows] = useState<ProspectRow[]>([])
  const [stats, setStats] = useState({ total: 0, hot: 0, awaitingEmail: 0 })
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [addForm, setAddForm] = useState(defaultAddForm)
  const [adding, setAdding] = useState(false)

  const fetchProspects = () => {
    setLoading(true)
    fetch("/api/prospects")
      .then(r => r.json())
      .then(data => {
        setProspectRows(data.prospects || [])
        setStats(data.stats || { total: 0, hot: 0, awaitingEmail: 0 })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchProspects() }, [])

  const filtered = prospectRows.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.company.toLowerCase().includes(search.toLowerCase()) ||
      (p.title ?? "").toLowerCase().includes(search.toLowerCase())
  )

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleAdd = async () => {
    setAdding(true)
    try {
      const res = await fetch("/api/prospects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addForm),
      })
      if (res.ok) {
        setShowAddModal(false)
        setAddForm(defaultAddForm)
        fetchProspects()
      }
    } catch {
      // silent
    } finally {
      setAdding(false)
    }
  }

  return (
    <div>
      <TopBar
        title="Prospects"
        description={`${stats.total} prospects in your pipeline`}
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
            { label: "Total Prospects", value: stats.total.toString(), color: "#5e6ad2" },
            { label: "Hot Leads", value: stats.hot.toString(), color: "#ef4444" },
            { label: "Awaiting Email", value: stats.awaitingEmail.toString(), color: "#f59e0b" },
            { label: "Enrichment Queue", value: "—", color: "#62666d" },
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
            <Button variant="default" size="sm" className="h-8 text-xs gap-1.5" onClick={() => setShowAddModal(true)}>
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
                        setSelected(e.target.checked ? prospectRows.map((p) => p.id) : [])
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
                {loading && prospectRows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-3">
                      <div className="space-y-2">
                        <div className="h-12 rounded-lg bg-[#141516] animate-pulse" />
                        <div className="h-12 rounded-lg bg-[#141516] animate-pulse" />
                        <div className="h-12 rounded-lg bg-[#141516] animate-pulse" />
                      </div>
                    </td>
                  </tr>
                ) : !loading && filtered.length === 0 && search === "" ? (
                  <tr>
                    <td colSpan={8}>
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="size-10 rounded-xl bg-[rgba(94,106,210,0.08)] border border-[rgba(94,106,210,0.15)] flex items-center justify-center mb-3">
                          <Users className="size-5 text-[#5e6ad2]" />
                        </div>
                        <p className="text-sm text-[#8a8f98] mb-1">No prospects yet</p>
                        <p className="text-xs text-[#62666d] mb-4">Add your first prospect to start tracking your pipeline.</p>
                        <Button size="sm" className="h-7 text-xs gap-1.5" onClick={() => setShowAddModal(true)}>
                          <Plus className="size-3" />Add prospect
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => {
                    const statusC = statusConfig[p.status] ?? statusConfig.warm
                    const score = p.score ?? 0
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
                            {!!p.linkedinUrl && (
                              <ExternalLink className="size-3 text-[#0a66c2] shrink-0" />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Building2 className="size-3 text-[#62666d]" />
                            <span className="text-sm text-[#d0d6e0]">{p.company}</span>
                            {p.industry && (
                              <Badge variant="secondary" className="text-[9px] h-3.5 py-0">{p.industry}</Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <TrendingUp className="size-3 text-[#27a644]" />
                            <span className="text-xs text-[#d0d6e0]">{p.triggerSignal ?? '—'}</span>
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
                                  stroke={score > 85 ? "#27a644" : score > 75 ? "#f59e0b" : "#ef4444"}
                                  strokeWidth="2.5"
                                  strokeDasharray={`${(score / 100) * 56.5} 56.5`}
                                />
                              </svg>
                              <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-[#f7f8f8]">{p.score ?? '—'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={statusC.variant} className="text-[10px] h-4 py-0">{statusC.label}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm text-[#8a8f98]">{p.emailsSent}</span>
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
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Add Prospect Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => { setShowAddModal(false); setAddForm(defaultAddForm) }}>
          <Card className="max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
            <CardContent className="pt-5 pb-5 space-y-4">
              <p className="text-sm font-semibold text-[#f7f8f8]">Add Prospect</p>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-[#8a8f98] mb-1 block">Name <span className="text-[#ef4444]">*</span></label>
                  <Input
                    placeholder="Sarah Chen"
                    value={addForm.name}
                    onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#8a8f98] mb-1 block">Company <span className="text-[#ef4444]">*</span></label>
                  <Input
                    placeholder="Acme Corp"
                    value={addForm.company}
                    onChange={e => setAddForm(f => ({ ...f, company: e.target.value }))}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#8a8f98] mb-1 block">Title</label>
                  <Input
                    placeholder="VP of Sales"
                    value={addForm.title}
                    onChange={e => setAddForm(f => ({ ...f, title: e.target.value }))}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#8a8f98] mb-1 block">Industry</label>
                  <Input
                    placeholder="SaaS"
                    value={addForm.industry}
                    onChange={e => setAddForm(f => ({ ...f, industry: e.target.value }))}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#8a8f98] mb-1 block">Trigger signal</label>
                  <Input
                    placeholder="Just promoted"
                    value={addForm.triggerSignal}
                    onChange={e => setAddForm(f => ({ ...f, triggerSignal: e.target.value }))}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#8a8f98] mb-1 block">Status</label>
                  <select
                    value={addForm.status}
                    onChange={e => setAddForm(f => ({ ...f, status: e.target.value }))}
                    className="w-full h-8 rounded-md border border-[#23252a] bg-[#141516] px-2.5 text-xs text-[#f7f8f8] outline-none focus:border-[#5e6ad2]"
                  >
                    <option value="warm">Warm</option>
                    <option value="hot">Hot</option>
                    <option value="cool">Cool</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => { setShowAddModal(false); setAddForm(defaultAddForm) }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="h-7 text-xs"
                  disabled={adding || !addForm.name.trim() || !addForm.company.trim()}
                  onClick={handleAdd}
                >
                  {adding ? "Saving..." : "Save"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
