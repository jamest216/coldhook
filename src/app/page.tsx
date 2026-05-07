import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { TickerBar } from "@/components/landing/ticker"
import { Features } from "@/components/landing/features"
import { ROICalculator } from "@/components/landing/calculator"
import { Testimonials } from "@/components/landing/testimonials"
import { Pricing } from "@/components/landing/pricing"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#010102]">
      <Navbar />
      <main>
        <Hero />
        <TickerBar />
        <Features />
        <ROICalculator />
        <Testimonials />
        <Pricing />
      </main>
      <Footer />
    </div>
  )
}
