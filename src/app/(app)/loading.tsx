import { Zap } from "lucide-react"

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#010102]">
      {/* Logo mark */}
      <div className="relative mb-8">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-[#5e6ad2]">
          <Zap className="size-7 text-white" />
        </div>
        {/* Pulse ring */}
        <div className="absolute inset-0 rounded-2xl bg-[#5e6ad2] animate-ping opacity-20" />
      </div>

      {/* Wordmark */}
      <p className="text-base font-semibold text-[#f7f8f8] tracking-tight mb-1">ColdHook</p>
      <p className="text-xs text-[#62666d] mb-10">Loading your workspace…</p>

      {/* Progress bar */}
      <div className="w-40 h-0.5 rounded-full bg-[#23252a] overflow-hidden">
        <div className="h-full w-full rounded-full bg-[#5e6ad2] origin-left animate-[loading-bar_1.4s_ease-in-out_infinite]" />
      </div>

      <style>{`
        @keyframes loading-bar {
          0%   { transform: translateX(-100%) scaleX(0.4); }
          50%  { transform: translateX(0%)    scaleX(0.7); }
          100% { transform: translateX(100%)  scaleX(0.4); }
        }
      `}</style>
    </div>
  )
}
