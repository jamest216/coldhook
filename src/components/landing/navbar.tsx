"use client"

import Link from "next/link"
import { useAuth } from "@clerk/nextjs"
import { Zap, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const { isSignedIn } = useAuth()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[rgba(35,37,42,0.8)] bg-[rgba(1,1,2,0.85)] backdrop-blur-md">
      <div className="max-w-5xl mx-auto flex h-14 items-center px-6 gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex size-7 items-center justify-center rounded-lg bg-[#5e6ad2]">
            <Zap className="size-4 text-white" />
          </div>
          <span className="font-semibold text-[#f7f8f8] tracking-tight">ColdHook</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {["Features", "Pricing", "Blog", "Docs"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              className="px-3 py-1.5 text-sm text-[#8a8f98] hover:text-[#f7f8f8] transition-colors rounded-md hover:bg-[#141516]"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Auth buttons */}
        <div className="flex items-center gap-2 ml-auto">
          <Button variant="ghost" size="sm" asChild>
            <Link href={isSignedIn ? "/dashboard" : "/sign-in"}>Sign in</Link>
          </Button>
          <Button size="sm" className="gap-1.5" asChild>
            <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
              Get started
              <ArrowRight className="size-3" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
