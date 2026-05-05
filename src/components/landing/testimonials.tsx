import { Star } from "lucide-react"

const testimonials = [
  {
    quote: "Went from a 12% reply rate to 31% in 3 weeks. The LinkedIn trigger feature is insane — it caught a prospect's job change and the email practically wrote itself.",
    name: "Marcus R.",
    role: "Senior AE @ Rippling",
    avatar: "MR",
    color: "#5e6ad2",
  },
  {
    quote: "I was skeptical about AI cold email tools. ColdHook is different — the emails don't sound robotic. My manager asked who wrote them. Said me.",
    name: "Priya S.",
    role: "SDR Team Lead @ Gong",
    avatar: "PS",
    color: "#ff801f",
  },
  {
    quote: "Cut my prospecting time from 4 hours a day to 45 minutes. Booked 8 meetings this week on a list of 60. That's a record for me.",
    name: "Tyler L.",
    role: "BDR @ Outreach.io",
    avatar: "TL",
    color: "#27a644",
  },
  {
    quote: "The A/B testing finally told me my CTAs were killing my replies. Switched to softer asks and my booking rate doubled.",
    name: "Aisha K.",
    role: "VP Sales @ Series B SaaS",
    avatar: "AK",
    color: "#a78bfa",
  },
  {
    quote: "ColdHook pulled a quote from a podcast my prospect was on two months ago. She replied within 20 minutes saying it was the best cold email she'd ever received.",
    name: "James D.",
    role: "Enterprise AE @ Salesforce",
    avatar: "JD",
    color: "#f59e0b",
  },
  {
    quote: "Entire SDR team went from 8% average to 22%. We're pacing to hit our H1 number in April. This is the unfair advantage we needed.",
    name: "Sam O.",
    role: "Head of Sales Development @ Notion",
    avatar: "SO",
    color: "#5e6ad2",
  },
]

export function Testimonials() {
  return (
    <section className="py-20 px-6 border-t border-[#23252a]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-semibold tracking-tight text-[#f7f8f8] mb-4">
            SDRs actually getting replies
          </h2>
          <p className="text-[#8a8f98] text-lg">
            Results from real sales professionals using ColdHook.
          </p>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="break-inside-avoid rounded-xl border border-[#23252a] bg-[#0f1011] p-5"
              style={{ boxShadow: "0 1px 3px rgba(50,50,93,0.25), 0 1px 0 rgba(0,0,0,0.1)" }}
            >
              <div className="flex mb-3">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="size-3 fill-[#f59e0b] text-[#f59e0b]" />
                ))}
              </div>
              <p className="text-sm text-[#d0d6e0] leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div
                  className="size-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ background: `linear-gradient(135deg, ${t.color} 0%, ${t.color}99 100%)` }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-xs font-medium text-[#f7f8f8]">{t.name}</p>
                  <p className="text-[11px] text-[#62666d]">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
