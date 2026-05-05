"use client"

import { Bell, Search, Sparkles } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface TopBarProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export function TopBar({ title, description, action }: TopBarProps) {
  const { user } = useUser()

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-[#23252a] bg-[#010102]/80 px-6 backdrop-blur-sm">
      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-semibold text-[#f7f8f8] truncate">{title}</h1>
        {description && (
          <p className="text-xs text-[#62666d] truncate">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-[#62666d]" />
          <Input
            placeholder="Search..."
            className="h-7 w-48 pl-8 text-xs bg-[#141516] border-[#1a1b1f] placeholder:text-[#62666d]"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-[#62666d] border border-[#23252a] rounded px-1 py-0.5">⌘K</kbd>
        </div>

        {/* Quick compose */}
        <Button variant="default" size="sm" className="h-7 text-xs gap-1.5" asChild>
          <Link href="/compose">
            <Sparkles className="size-3" />
            New Email
          </Link>
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon-sm" className="relative size-7">
          <Bell className="size-4" />
          <span className="absolute top-1 right-1 size-1.5 rounded-full bg-[#5e6ad2]" />
        </Button>

        <Link href="/settings">
          <Avatar className="size-7 cursor-pointer ring-1 ring-transparent hover:ring-[#34343a] transition-all">
            <AvatarImage src={user?.imageUrl} alt={user?.fullName ?? ""} />
            <AvatarFallback className="text-[10px] bg-[#141516] text-[#8a8f98]">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
        </Link>

        {action}
      </div>
    </header>
  )
}
