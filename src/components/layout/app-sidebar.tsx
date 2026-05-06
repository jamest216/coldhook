"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUser, useClerk } from "@clerk/nextjs"
import {
  LayoutDashboard,
  Mail,
  Users,
  FileText,
  Settings,
  Zap,
  ChevronRight,
  BarChart3,
  Sparkles,
  LogOut,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuItem } from "@radix-ui/react-dropdown-menu"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/compose", icon: Sparkles, label: "AI Compose", badge: "AI" },
  { href: "/prospects", icon: Users, label: "Prospects" },
  { href: "/templates", icon: FileText, label: "Templates" },
  { href: "/analytics", icon: BarChart3, label: "Analytics", badge: "Soon", disabled: true },
  { href: "/settings", icon: Settings, label: "Settings" },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user } = useUser()
  const { signOut } = useClerk()

  const [emailStats, setEmailStats] = useState<{
    emailsTotal: number
    emailsThisMonth: number
    replyRate: number | null
    prospectsThisMonth: number
  } | null>(null)

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(data => setEmailStats(data))
      .catch(() => {})
  }, [])

  return (
    <TooltipProvider delayDuration={0}>
      <aside className="fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-[#23252a] bg-[#0f1011]">
        {/* Logo */}
        <div className="flex h-14 items-center gap-2.5 border-b border-[#23252a] px-4">
          <div className="flex size-7 items-center justify-center rounded-lg bg-[#5e6ad2]">
            <Zap className="size-4 text-white" />
          </div>
          <span className="font-semibold text-[#f7f8f8] tracking-tight">ColdHook</span>
          <Badge variant="default" className="ml-auto text-[10px] py-0">Beta</Badge>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
          <div className="mb-4 mt-2">
            <p className="px-3 mb-1.5 text-[10px] font-medium uppercase tracking-widest text-[#62666d]">
              Workspace
            </p>
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
              const Icon = item.icon
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.disabled ? "#" : item.href}
                      className={cn(
                        "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150",
                        isActive
                          ? "bg-[rgba(94,106,210,0.12)] text-[#f7f8f8]"
                          : "text-[#8a8f98] hover:bg-[#141516] hover:text-[#d0d6e0]",
                        item.disabled && "pointer-events-none opacity-50"
                      )}
                    >
                      <Icon className={cn("size-4 shrink-0", isActive ? "text-[#5e6ad2]" : "text-[#62666d] group-hover:text-[#8a8f98]")} />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <Badge
                          variant={item.badge === "AI" ? "default" : "secondary"}
                          className={cn("text-[10px] py-0 h-4", item.badge === "AI" && "bg-[rgba(94,106,210,0.2)] text-[#828fff] border-[rgba(94,106,210,0.3)]")}
                        >
                          {item.badge}
                        </Badge>
                      )}
                      {isActive && (
                        <ChevronRight className="size-3 text-[#5e6ad2]" />
                      )}
                    </Link>
                  </TooltipTrigger>
                </Tooltip>
              )
            })}
          </div>

          {/* Quick Stats */}
          <div className="mt-auto">
            <p className="px-3 mb-1.5 text-[10px] font-medium uppercase tracking-widest text-[#62666d]">
              This Month
            </p>
            <div className="mx-1 rounded-lg border border-[#23252a] bg-[#141516] p-3 space-y-2">
              <StatRow
                label="Emails Sent"
                value={emailStats ? emailStats.emailsTotal.toLocaleString() : '—'}
                trend={emailStats && emailStats.emailsThisMonth > 0 ? `+${emailStats.emailsThisMonth} mo` : undefined}
              />
              <StatRow
                label="Reply Rate"
                value={emailStats ? (emailStats.replyRate !== null ? `${emailStats.replyRate}%` : '—') : '—'}
                trend={emailStats?.replyRate !== null && emailStats?.replyRate !== undefined ? 'vs 8% avg' : undefined}
              />
              <StatRow
                label="Meetings Booked"
                value="—"
                trend={undefined}
              />
            </div>
          </div>
        </nav>

        {/* User */}
        <div className="border-t border-[#23252a] p-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-[#141516] transition-colors cursor-pointer">
                <Avatar className="size-7">
                  <AvatarImage src={user?.imageUrl} alt={user?.fullName || ""} />
                  <AvatarFallback className="text-[10px]">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#f7f8f8] truncate">
                    {user?.firstName && user?.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : "Loading..."}
                  </p>
                  <p className="text-[10px] text-[#62666d] truncate">
                    {user?.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
                <ChevronRight className="size-3 text-[#62666d]" />
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              side="top"
              align="start"
              sideOffset={8}
              className="z-[200] min-w-[200px] rounded-lg border border-[#23252a] bg-[#141516] p-1 shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
            >
              <DropdownMenuItem
                className="px-2.5 py-2 outline-none"
                onSelect={e => e.preventDefault()}
              >
                <div>
                  <p className="text-xs font-medium text-[#f7f8f8]">
                    {user?.fullName}
                  </p>
                  <p className="text-[10px] text-[#62666d]">
                    {user?.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-1 h-px bg-[#23252a]" />

              <DropdownMenuItem asChild>
                <Link
                  href="/settings"
                  className="flex items-center gap-2.5 px-2.5 py-2 text-xs text-[#8a8f98] rounded-md cursor-pointer hover:bg-[#1c1d1e] hover:text-[#f7f8f8] outline-none transition-colors"
                >
                  <Settings className="size-3.5 text-[#62666d]" />
                  Settings
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-1 h-px bg-[#23252a]" />

              <DropdownMenuItem
                onSelect={() => signOut({ redirectUrl: "/sign-in" })}
                className="flex items-center gap-2.5 px-2.5 py-2 text-xs text-[#8a8f98] rounded-md cursor-pointer hover:bg-[rgba(239,68,68,0.06)] hover:text-[#ef4444] outline-none transition-colors"
              >
                <LogOut className="size-3.5" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
    </TooltipProvider>
  )
}

function StatRow({ label, value, trend }: { label: string; value: string; trend?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-[#62666d]">{label}</span>
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-medium text-[#d0d6e0]">{value}</span>
        {trend && <span className="text-[10px] text-[#27a644]">{trend}</span>}
      </div>
    </div>
  )
}
