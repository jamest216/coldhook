"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { TopBar } from "@/components/layout/top-bar"
import {
  Plus,
  Search,
  Copy,
  Edit,
  Star,
  TrendingUp,
  Mail,
  Sparkles,
  MoreHorizontal,
  Tag,
  BarChart3,
  Trash2,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type Template = {
  id: string
  name: string
  category: string
  description: string | null
  subject: string
  body: string
  tone: string | null
  tags: string[] | null
  starred: boolean
  uses: number
  replyRate: number | null
  createdAt: string
  updatedAt: string
}

type FormState = {
  name: string
  category: string
  description: string
  subject: string
  body: string
  tone: string
}

const EMPTY_FORM: FormState = {
  name: "",
  category: "Custom",
  description: "",
  subject: "",
  body: "",
  tone: "conversational",
}

const CATEGORIES = ["All", "Cold Outreach", "Trigger-Based", "Content-Based", "Competitive", "Follow-up", "Custom"]

export default function TemplatesPage() {
  const router = useRouter()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState("")
  const [activeCategory, setActiveCategory] = useState("All")

  // "..." dropdown state
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Modal state
  const [modalOpen, setModalOpen]         = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [form, setForm]                   = useState<FormState>(EMPTY_FORM)
  const [saving, setSaving]               = useState(false)

  // Starred animation tracking
  const [starringId, setStarringId] = useState<string | null>(null)

  // ── Load ──────────────────────────────────────────────────────────────
  useEffect(() => {
    fetch("/api/templates")
      .then(r => r.json())
      .then(setTemplates)
      .finally(() => setLoading(false))
  }, [])

  // Close "..." menu on outside click
  useEffect(() => {
    if (!openMenu) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [openMenu])

  // ── Star toggle ───────────────────────────────────────────────────────
  const toggleStar = useCallback((t: Template) => {
    const next = !t.starred
    setTemplates(prev => prev.map(x => x.id === t.id ? { ...x, starred: next } : x))
    setStarringId(t.id)
    setTimeout(() => setStarringId(null), 400)
    fetch(`/api/templates/${t.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ starred: next }),
    }).catch(() => {
      // revert on failure
      setTemplates(prev => prev.map(x => x.id === t.id ? { ...x, starred: t.starred } : x))
    })
  }, [])

  // ── Duplicate ─────────────────────────────────────────────────────────
  const duplicate = useCallback(async (t: Template) => {
    setOpenMenu(null)
    const res = await fetch(`/api/templates/${t.id}?action=duplicate`, { method: "POST" })
    if (res.ok) {
      const copy = await res.json()
      setTemplates(prev => [copy, ...prev])
    }
  }, [])

  // ── Delete ────────────────────────────────────────────────────────────
  const deleteTemplate = useCallback(async (t: Template) => {
    setOpenMenu(null)
    if (!window.confirm(`Delete "${t.name}"? This cannot be undone.`)) return
    await fetch(`/api/templates/${t.id}`, { method: "DELETE" })
    setTemplates(prev => prev.filter(x => x.id !== t.id))
  }, [])

  // ── Modal helpers ─────────────────────────────────────────────────────
  const openCreate = () => {
    setEditingTemplate(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  const openEdit = (t: Template) => {
    setOpenMenu(null)
    setEditingTemplate(t)
    setForm({
      name:        t.name,
      category:    t.category,
      description: t.description ?? "",
      subject:     t.subject,
      body:        t.body,
      tone:        t.tone ?? "conversational",
    })
    setModalOpen(true)
  }

  const saveModal = async () => {
    if (!form.name.trim() || !form.subject.trim() || !form.body.trim()) return
    setSaving(true)
    try {
      if (editingTemplate) {
        const res = await fetch(`/api/templates/${editingTemplate.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
        if (res.ok) {
          const updated = await res.json()
          setTemplates(prev => prev.map(x => x.id === editingTemplate.id ? updated : x))
        }
      } else {
        const res = await fetch("/api/templates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
        if (res.ok) {
          const created = await res.json()
          setTemplates(prev => [created, ...prev])
        }
      }
      setModalOpen(false)
    } finally {
      setSaving(false)
    }
  }

  // ── Use template ──────────────────────────────────────────────────────
  const useTemplate = (t: Template) => {
    const params = new URLSearchParams({
      templateSubject: t.subject,
      templateBody:    t.body,
      templateTone:    t.tone ?? "conversational",
    })
    router.push(`/compose?${params.toString()}`)
  }

  // ── Derived stats ─────────────────────────────────────────────────────
  const totalUses = templates.reduce((s, t) => s + t.uses, 0)

  // ── Filter ────────────────────────────────────────────────────────────
  const filtered = templates.filter(t => {
    const q = search.toLowerCase()
    const matchSearch = !q || t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
    const matchCat = activeCategory === "All" || t.category === activeCategory
    return matchSearch && matchCat
  })

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div>
      <style>{`
        @keyframes star-pop {
          0%   { transform: scale(1); }
          50%  { transform: scale(1.4); }
          100% { transform: scale(1); }
        }
        .star-pop { animation: star-pop 0.35s ease-out; }
      `}</style>

      <TopBar
        title="Templates"
        description="Your personalized email template library"
        action={
          <Button size="sm" className="h-7 text-xs gap-1.5" onClick={openCreate}>
            <Plus className="size-3" />
            New template
          </Button>
        }
      />

      <div className="p-6 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="pt-3 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="size-4 shrink-0 text-[#5e6ad2]" />
                <span className="text-xs text-[#8a8f98]">Templates</span>
              </div>
              <span className="text-sm font-semibold text-[#5e6ad2]">{templates.length}</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-3 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="size-4 shrink-0 text-[#27a644]" />
                <span className="text-xs text-[#8a8f98]">Avg reply rate</span>
              </div>
              <span className="text-sm font-semibold text-[#62666d]">—</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-3 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="size-4 shrink-0 text-[#ff801f]" />
                <span className="text-xs text-[#8a8f98]">Total uses</span>
              </div>
              <span className="text-sm font-semibold text-[#62666d]">{totalUses > 0 ? totalUses : "—"}</span>
            </CardContent>
          </Card>
        </div>

        {/* Filter row */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-[#62666d]" />
            <Input
              placeholder="Search templates..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 h-8 text-xs w-56"
            />
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                  activeCategory === cat
                    ? "bg-[rgba(94,106,210,0.15)] text-[#828fff] border border-[rgba(94,106,210,0.3)]"
                    : "text-[#62666d] hover:text-[#8a8f98] hover:bg-[#141516]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1,2,3].map(i => (
              <Card key={i} className="flex flex-col">
                <CardContent className="pt-5 space-y-3">
                  {[70, 45, 90, 60].map((w, j) => (
                    <div key={j} className="h-3 rounded-full bg-[#141516] animate-pulse" style={{ width: `${w}%` }} />
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && templates.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="size-14 rounded-2xl bg-[rgba(94,106,210,0.08)] border border-[rgba(94,106,210,0.15)] flex items-center justify-center mb-4">
              <Mail className="size-7 text-[#5e6ad2]" />
            </div>
            <p className="text-sm text-[#8a8f98] mb-1">No templates yet</p>
            <p className="text-xs text-[#62666d] mb-4">Create your first template to speed up your outreach</p>
            <Button size="sm" className="gap-1.5" onClick={openCreate}>
              <Plus className="size-3.5" />
              Create your first template
            </Button>
          </div>
        )}

        {/* Template grid */}
        {!loading && templates.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(t => (
              <Card key={t.id} className="flex flex-col hover:border-[#34343a] transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-sm truncate">{t.name}</CardTitle>
                        <button
                          onClick={() => toggleStar(t)}
                          className={`shrink-0 ${starringId === t.id ? "star-pop" : ""}`}
                          aria-label={t.starred ? "Unstar" : "Star"}
                        >
                          <Star
                            className={`size-3 transition-colors ${
                              t.starred
                                ? "fill-[#f59e0b] text-[#f59e0b]"
                                : "text-[#3a3b40] hover:text-[#f59e0b]"
                            }`}
                          />
                        </button>
                      </div>
                      <Badge variant="secondary" className="text-[9px] h-4 py-0">{t.category}</Badge>
                    </div>

                    {/* "..." menu */}
                    <div className="relative shrink-0" ref={openMenu === t.id ? menuRef : undefined}>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="size-6"
                        onClick={() => setOpenMenu(openMenu === t.id ? null : t.id)}
                      >
                        <MoreHorizontal className="size-3.5" />
                      </Button>
                      {openMenu === t.id && (
                        <div className="absolute right-0 top-7 z-50 w-36 rounded-lg border border-[#23252a] bg-[#0f1011] shadow-xl py-1">
                          <button
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[#d0d6e0] hover:bg-[#141516] transition-colors"
                            onClick={() => openEdit(t)}
                          >
                            <Edit className="size-3" /> Edit
                          </button>
                          <button
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[#d0d6e0] hover:bg-[#141516] transition-colors"
                            onClick={() => duplicate(t)}
                          >
                            <Copy className="size-3" /> Duplicate
                          </button>
                          <button
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[#ef4444] hover:bg-[#141516] transition-colors"
                            onClick={() => deleteTemplate(t)}
                          >
                            <Trash2 className="size-3" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 space-y-3">
                  {t.description && (
                    <p className="text-xs text-[#8a8f98] leading-relaxed">{t.description}</p>
                  )}

                  <div className="rounded-lg bg-[#141516] border border-[#23252a] p-3 space-y-2">
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-[#62666d] mb-1">Subject</p>
                      <p className="text-xs text-[#d0d6e0] font-medium">{t.subject}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-[#62666d] mb-1">Preview</p>
                      <p className="text-xs text-[#8a8f98] line-clamp-2 leading-relaxed">{t.body}</p>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center gap-3 text-[10px] text-[#62666d]">
                    <span>{t.uses} uses</span>
                    <span>Reply rate: {t.replyRate != null ? `${t.replyRate}%` : "—"}</span>
                    {t.tone && <span className="capitalize">{t.tone}</span>}
                  </div>

                  {t.tags && t.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {t.tags.map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded border border-[#23252a] text-[#62666d]"
                        >
                          <Tag className="size-2" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 pt-1 border-t border-[#1a1b1f]">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 h-7 text-xs gap-1"
                      onClick={() => duplicate(t)}
                    >
                      <Copy className="size-3" />
                      Duplicate
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 h-7 text-xs gap-1"
                      onClick={() => openEdit(t)}
                    >
                      <Edit className="size-3" />
                      Edit
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1 h-7 text-xs gap-1"
                      onClick={() => useTemplate(t)}
                    >
                      <Sparkles className="size-3" />
                      Use
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={e => { if (e.target === e.currentTarget) setModalOpen(false) }}
        >
          <div className="w-full max-w-lg rounded-2xl border border-[#23252a] bg-[#0f1011] shadow-2xl">
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-[#23252a]">
              <p className="text-sm font-semibold text-[#f7f8f8]">
                {editingTemplate ? "Edit template" : "New template"}
              </p>
              <button onClick={() => setModalOpen(false)} className="text-[#62666d] hover:text-[#8a8f98]">
                <X className="size-4" />
              </button>
            </div>
            <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
              <div className="space-y-1.5">
                <label className="text-xs text-[#8a8f98]">Name <span className="text-[#ef4444]">*</span></label>
                <Input
                  placeholder="e.g. Job Promotion Hook"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-[#8a8f98]">Category</label>
                  <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Trigger-Based","Content-Based","Competitive","Follow-up","Custom"].map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-[#8a8f98]">Tone</label>
                  <Select value={form.tone} onValueChange={v => setForm(f => ({ ...f, tone: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conversational">Conversational</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="bold">Bold & Direct</SelectItem>
                      <SelectItem value="curious">Curious</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-[#8a8f98]">Description</label>
                <Input
                  placeholder="Briefly describe when to use this template"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-[#8a8f98]">Subject <span className="text-[#ef4444]">*</span></label>
                <Input
                  placeholder="e.g. Congrats on the promotion 🎉"
                  value={form.subject}
                  onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-[#8a8f98]">Body <span className="text-[#ef4444]">*</span></label>
                <Textarea
                  rows={8}
                  placeholder="Write your template body here..."
                  value={form.body}
                  onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                  className="text-sm font-mono"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-[#23252a]">
              <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button
                size="sm"
                disabled={saving || !form.name.trim() || !form.subject.trim() || !form.body.trim()}
                onClick={saveModal}
              >
                {saving ? "Saving..." : editingTemplate ? "Save changes" : "Create template"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
