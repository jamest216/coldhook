"use client"

import { useAuth } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Zap } from "lucide-react"

const MIN_LOADING_MS = 1800

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isLoaded } = useAuth()
  const [minElapsed, setMinElapsed] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMinElapsed(true), MIN_LOADING_MS)
    return () => clearTimeout(t)
  }, [])

  if (!isLoaded || !minElapsed) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#010102]">
        <div className="relative mb-8">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-[#5e6ad2]">
            <Zap className="size-7 text-white" />
          </div>
          <div className="absolute inset-0 rounded-2xl bg-[#5e6ad2] animate-ping opacity-20" />
        </div>
        <p className="text-base font-semibold text-[#f7f8f8] tracking-tight mb-1">ColdHook</p>
        <p className="text-xs text-[#62666d] mb-10">Loading your workspace…</p>
        <div className="w-40 h-0.5 rounded-full bg-[#23252a] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#5e6ad2]"
            style={{ animation: "loadingBar 1.4s ease-in-out infinite" }}
          />
        </div>
        <style>{`
          @keyframes loadingBar {
            0%   { width: 0%;   margin-left: 0%; }
            50%  { width: 60%;  margin-left: 20%; }
            100% { width: 0%;   margin-left: 100%; }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#010102]">
      <AppSidebar />
      <main className="ml-60 flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
