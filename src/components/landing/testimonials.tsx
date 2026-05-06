import Link from "next/link"
import { Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Testimonials() {
  return (
    <section className="py-20 px-6 border-t border-[#23252a]">
      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(94,106,210,0.3)] bg-[rgba(94,106,210,0.08)] px-3 py-1 text-xs text-[#828fff] mb-6">
          <Sparkles className="size-3" />
          Early access
        </div>
        <h2 className="text-4xl font-semibold tracking-tight text-[#f7f8f8] mb-4">
          Be one of our first power users
        </h2>
        <p className="text-[#8a8f98] text-lg mb-10 max-w-xl mx-auto">
          ColdHook is in private beta. Join free, use every feature, and help shape what we build next.
        </p>

        <div className="rounded-2xl border border-[rgba(94,106,210,0.25)] bg-[rgba(94,106,210,0.05)] p-8 max-w-lg mx-auto">
          <div className="flex flex-col items-center gap-4">
            <div className="size-12 rounded-2xl bg-[rgba(94,106,210,0.15)] border border-[rgba(94,106,210,0.2)] flex items-center justify-center">
              <Sparkles className="size-6 text-[#5e6ad2]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#f7f8f8] mb-1">Free during beta</p>
              <p className="text-xs text-[#8a8f98] leading-relaxed">
                No credit card. No limits. Full access to AI compose, prospect tracking, and follow-up sequences — free while we&apos;re in beta.
              </p>
            </div>
            <Button size="lg" className="h-11 px-8 text-base font-medium gap-2 mt-2" asChild>
              <Link href="/sign-up">
                Get free early access
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
