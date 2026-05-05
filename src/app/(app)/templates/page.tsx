"use client"

import { useState } from "react"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const templates = [
  {
    id: 1,
    name: "Job Promotion Hook",
    category: "Trigger-Based",
    description: "Opens with congratulations on a recent promotion, ties to pain of scaling a new team.",
    subject: "Congrats on the {{role}} promotion 🎉",
    preview: "Just saw the announcement about your promotion to {{role}} — huge congrats on the {{metric}} that clearly made it happen...",
    replyRate: 34,
    opens: 67,
    uses: 248,
    starred: true,
    tags: ["Promotion", "Sales Leader"],
    tone: "Conversational",
  },
  {
    id: 2,
    name: "Funding Announcement",
    category: "Trigger-Based",
    description: "Catches prospects right after a funding round when growth pain is top of mind.",
    subject: "Saw the {{round}} raise — congrats",
    preview: "Just read about your {{round}} — impressive. When you're scaling from {{headcount1}} to {{headcount2}} reps...",
    replyRate: 28,
    opens: 61,
    uses: 183,
    starred: true,
    tags: ["Funding", "Scale"],
    tone: "Professional",
  },
  {
    id: 3,
    name: "Podcast Guest Callout",
    category: "Content-Based",
    description: "References a specific insight from a podcast or talk the prospect was featured in.",
    subject: "Your {{podcast}} episode on {{topic}}",
    preview: "I was listening to your {{podcast}} episode last week — the part where you talked about {{insight}} resonated...",
    replyRate: 41,
    opens: 72,
    uses: 97,
    starred: false,
    tags: ["Content", "Thought Leader"],
    tone: "Curious",
  },
  {
    id: 4,
    name: "Competitor Win",
    category: "Competitive",
    description: "Tactfully references a competitor they likely use, offers a better alternative.",
    subject: "How {{company}} replaced {{competitor}}",
    preview: "I noticed {{company}} is using {{competitor}} for sales coaching. We've been helping companies like {{similar}} achieve...",
    replyRate: 22,
    opens: 54,
    uses: 142,
    starred: false,
    tags: ["Competitive", "ROI"],
    tone: "Bold",
  },
  {
    id: 5,
    name: "LinkedIn Post Reply",
    category: "Content-Based",
    description: "Responds to a specific LinkedIn post the prospect made with a genuine insight.",
    subject: "Re: your post on {{topic}}",
    preview: "Your post about {{topic}} stopped my scroll. The point about {{insight}} is something I think about a lot too...",
    replyRate: 38,
    opens: 69,
    uses: 76,
    starred: true,
    tags: ["LinkedIn", "Engagement"],
    tone: "Conversational",
  },
  {
    id: 6,
    name: "Short Breakup",
    category: "Follow-up",
    description: "3-line breakup email for sequences. Combines humor with one last value prop.",
    subject: "Should I give up?",
    preview: "I've reached out a couple times and haven't heard back — totally fair. I'll assume the timing is off...",
    replyRate: 18,
    opens: 52,
    uses: 312,
    starred: false,
    tags: ["Breakup", "Sequence"],
    tone: "Conversational",
  },
]

const categories = ["All", "Trigger-Based", "Content-Based", "Competitive", "Follow-up"]

export default function TemplatesPage() {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")

  const filtered = templates.filter((t) => {
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
    const matchCategory = activeCategory === "All" || t.category === activeCategory
    return matchSearch && matchCategory
  })

  return (
    <div>
      <TopBar
        title="Templates"
        description="Your personalized email template library"
        action={
          <Button size="sm" className="h-7 text-xs gap-1.5">
            <Plus className="size-3" />
            New template
          </Button>
        }
      />

      <div className="p-6 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Templates", value: templates.length, icon: Mail, color: "#5e6ad2" },
            { label: "Avg reply rate", value: "30.2%", icon: TrendingUp, color: "#27a644" },
            { label: "Total uses", value: "1,058", icon: BarChart3, color: "#ff801f" },
          ].map((s) => {
            const Icon = s.icon
            return (
              <Card key={s.label}>
                <CardContent className="pt-3 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="size-4 shrink-0" style={{ color: s.color }} />
                    <span className="text-xs text-[#8a8f98]">{s.label}</span>
                  </div>
                  <span className="text-sm font-semibold" style={{ color: s.color }}>{s.value}</span>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Filter row */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-[#62666d]" />
            <Input
              placeholder="Search templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-xs w-56"
            />
          </div>
          <div className="flex items-center gap-1">
            {categories.map((cat) => (
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

        {/* Template grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((template) => (
            <Card
              key={template.id}
              className="flex flex-col hover:border-[#34343a] transition-colors"
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-sm truncate">{template.name}</CardTitle>
                      {template.starred && (
                        <Star className="size-3 fill-[#f59e0b] text-[#f59e0b] shrink-0" />
                      )}
                    </div>
                    <Badge variant="secondary" className="text-[9px] h-4 py-0">{template.category}</Badge>
                  </div>
                  <Button variant="ghost" size="icon-sm" className="size-6 shrink-0">
                    <MoreHorizontal className="size-3.5" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="flex-1 space-y-3">
                <p className="text-xs text-[#8a8f98] leading-relaxed">{template.description}</p>

                <div className="rounded-lg bg-[#141516] border border-[#23252a] p-3 space-y-2">
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-[#62666d] mb-1">Subject</p>
                    <p className="text-xs text-[#d0d6e0] font-medium">{template.subject}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-[#62666d] mb-1">Preview</p>
                    <p className="text-xs text-[#8a8f98] line-clamp-2 leading-relaxed">{template.preview}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="size-3 text-[#27a644]" />
                    <span className="text-[#27a644] font-medium">{template.replyRate}%</span>
                    <span className="text-[#62666d]">reply</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="size-3 text-[#62666d]" />
                    <span className="text-[#62666d]">{template.opens}% open</span>
                  </div>
                  <div className="ml-auto flex items-center gap-1 text-[#62666d]">
                    <span>{template.uses}×</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {template.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded border border-[#23252a] text-[#62666d]"
                    >
                      <Tag className="size-2" />
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 pt-1 border-t border-[#1a1b1f]">
                  <Button variant="ghost" size="sm" className="flex-1 h-7 text-xs gap-1">
                    <Copy className="size-3" />
                    Duplicate
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1 h-7 text-xs gap-1">
                    <Edit className="size-3" />
                    Edit
                  </Button>
                  <Button variant="default" size="sm" className="flex-1 h-7 text-xs gap-1">
                    <Sparkles className="size-3" />
                    Use
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
