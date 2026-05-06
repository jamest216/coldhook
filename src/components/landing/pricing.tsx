"use client"

import { CheckIcon, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "/mo",
    description: "Perfect for trying ColdHook and solo prospecting.",
    cta: "Get started free",
    ctaVariant: "outline" as const,
    features: [
      "50 AI-generated emails/month",
      "LinkedIn URL enrichment",
      "5 email templates",
      "Basic analytics",
      "Email spam scoring",
    ],
    notIncluded: ["A/B testing", "CRM integrations", "Team collaboration"],
  },
  {
    name: "Pro",
    price: "$49",
    period: "/mo",
    description: "For individual SDRs serious about hitting quota.",
    cta: "Start Pro trial",
    ctaVariant: "default" as const,
    featured: true,
    features: [
      "500 AI-generated emails/month",
      "LinkedIn + company enrichment",
      "Unlimited templates",
      "A/B testing (up to 4 variants)",
      "Full analytics & reply tracking",
      "Trigger monitoring (funding, news)",
      "Salesforce & HubSpot sync",
      "Priority support",
    ],
  },
  {
    name: "Team",
    price: "$149",
    period: "/mo",
    description: "For sales teams that want to outbound at scale.",
    cta: "Contact sales",
    ctaVariant: "outline" as const,
    features: [
      "Unlimited AI-generated emails",
      "All Pro features",
      "Up to 10 seats",
      "Shared template library",
      "Team analytics & leaderboard",
      "Sequence builder",
      "Custom AI persona training",
      "Dedicated CSM",
    ],
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="py-20 px-6 border-t border-[#23252a]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(94,106,210,0.3)] bg-[rgba(94,106,210,0.08)] px-3 py-1 text-xs text-[#828fff] mb-4">
            <Zap className="size-3" />
            Pricing
          </div>
          <h2 className="text-4xl font-semibold tracking-tight text-[#f7f8f8] mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-[#8a8f98] text-lg">
            No seat fees per email, no surprises. Cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-6 ${
                plan.featured
                  ? "border-[rgba(94,106,210,0.5)] bg-[rgba(94,106,210,0.05)]"
                  : "border-[#23252a] bg-[#0f1011]"
              }`}
              style={{
                boxShadow: plan.featured
                  ? "0 0 0 1px rgba(94,106,210,0.3), 0 13px 27px rgba(50,50,93,0.25), 0 8px 16px rgba(0,0,0,0.2)"
                  : "0 1px 3px rgba(50,50,93,0.25), 0 1px 0 rgba(0,0,0,0.1)"
              }}
            >
              {plan.featured && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs">
                  Most popular
                </Badge>
              )}

              <div className="mb-6">
                <h3 className="font-semibold text-[#f7f8f8] mb-1">{plan.name}</h3>
                <p className="text-xs text-[#62666d] mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight text-[#f7f8f8]">{plan.price}</span>
                  <span className="text-sm text-[#62666d]">{plan.period}</span>
                </div>
              </div>

              {plan.name === "Starter" ? (
                <Button variant={plan.ctaVariant} className="w-full mb-6" asChild>
                  <Link href="/sign-up">{plan.cta}</Link>
                </Button>
              ) : (
                <Button variant="secondary" className="w-full mb-6" disabled>
                  Coming soon
                </Button>
              )}

              <ul className="space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[#d0d6e0]">
                    <CheckIcon className="size-4 shrink-0 mt-0.5 text-[#27a644]" />
                    {f}
                  </li>
                ))}
                {plan.notIncluded?.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[#62666d] line-through">
                    <span className="size-4 shrink-0 mt-0.5 flex items-center justify-center text-[#34343a]">—</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
