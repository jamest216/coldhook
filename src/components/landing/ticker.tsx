"use client"

const items = [
  { trigger: "Promoted to VP of Sales", result: "→ personalized email in 8s" },
  { trigger: "Just raised Series B", result: "→ hook written around their growth pain" },
  { trigger: "Posted about hiring 10 SDRs", result: "→ trigger detected, email ready" },
  { trigger: "Switched from Salesforce to HubSpot", result: "→ relevant pain point surfaced" },
  { trigger: "Featured on SaaStr podcast", result: "→ opening line built from their quote" },
  { trigger: "Expanded to EMEA market", result: "→ localized outreach generated" },
  { trigger: "Promoted to CRO", result: "→ pipeline-focused email drafted" },
  { trigger: "New product launch announced", result: "→ timing hook written automatically" },
]

export function TickerBar() {
  return (
    <div className="border-t border-b border-[var(--color-hairline)] bg-[var(--color-surface-1)]">
      <style>{`
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      <div
        className="overflow-hidden py-3"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      >
        <div
          className="flex w-max"
          style={{ animation: "ticker-scroll 40s linear infinite" }}
        >
          {[...items, ...items].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 shrink-0 mx-5">
              <span className="text-sm font-medium" style={{ color: "var(--color-accent)" }}>
                {item.trigger}
              </span>
              <span className="text-sm text-[var(--color-ink-subtle)]">{item.result}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
