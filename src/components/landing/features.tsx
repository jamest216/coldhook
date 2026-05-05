import {
  Sparkles,
  Globe,
  Link2,
  BarChart3,
  RefreshCw,
  Shield,
  Zap,
  Users,
  FileText,
} from "lucide-react"

const features = [
  {
    icon: Sparkles,
    color: "#5e6ad2",
    bg: "rgba(94,106,210,0.12)",
    border: "rgba(94,106,210,0.2)",
    title: "AI Personalization Engine",
    description: "Claude analyzes your prospect's LinkedIn, recent news, job changes, and company milestones to craft unique hooks.",
  },
  {
    icon: Globe,
    color: "#ff801f",
    bg: "rgba(255,128,31,0.12)",
    border: "rgba(255,128,31,0.2)",
    title: "Trigger-Based Outreach",
    description: "Auto-detect buying signals: funding rounds, new hires, product launches, and exec changes — strike while it's hot.",
  },
  {
    icon: BarChart3,
    color: "#27a644",
    bg: "rgba(39,166,68,0.12)",
    border: "rgba(39,166,68,0.2)",
    title: "Reply Rate Analytics",
    description: "Track open rates, reply rates, and meeting bookings by template variant. Know what's working and double down.",
  },
  {
    icon: RefreshCw,
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.12)",
    border: "rgba(167,139,250,0.2)",
    title: "A/B Testing",
    description: "Test subject lines, hooks, and CTAs automatically. ColdHook surfaces winners and retires losers.",
  },
  {
    icon: Link2,
    color: "#0a66c2",
    bg: "rgba(10,102,194,0.12)",
    border: "rgba(10,102,194,0.2)",
    title: "LinkedIn Enrichment",
    description: "Paste a LinkedIn URL and we'll pull job history, skills, mutual connections, and recent posts in one click.",
  },
  {
    icon: Shield,
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
    border: "rgba(245,158,11,0.2)",
    title: "Spam Score Check",
    description: "Every email is scored for spam signals before you send. Keep your sender reputation pristine.",
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 px-6 border-t border-[#23252a]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(94,106,210,0.3)] bg-[rgba(94,106,210,0.08)] px-3 py-1 text-xs text-[#828fff] mb-4">
            <Zap className="size-3" />
            Features
          </div>
          <h2 className="text-4xl font-semibold tracking-tight text-[#f7f8f8] mb-4">
            Everything your pipeline needs
          </h2>
          <p className="text-[#8a8f98] text-lg max-w-2xl mx-auto">
            From prospect research to send — ColdHook handles the entire cold outreach workflow so you can focus on closing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="group rounded-xl border border-[#23252a] bg-[#0f1011] p-6 transition-all duration-200 hover:border-[#34343a] hover:bg-[#141516]"
                style={{
                  boxShadow: "0 1px 3px rgba(50,50,93,0.25), 0 1px 0 rgba(0,0,0,0.1)"
                }}
              >
                <div
                  className="mb-4 inline-flex size-10 items-center justify-center rounded-lg border"
                  style={{ background: feature.bg, borderColor: feature.border }}
                >
                  <Icon className="size-5" style={{ color: feature.color }} />
                </div>
                <h3 className="mb-2 font-semibold text-[#f7f8f8] tracking-tight">{feature.title}</h3>
                <p className="text-sm text-[#8a8f98] leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
