import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[rgba(94,106,210,0.15)] text-[#828fff] border border-[rgba(94,106,210,0.25)]",
        secondary: "bg-[#141516] text-[#8a8f98] border border-[#23252a]",
        success: "bg-[rgba(39,166,68,0.15)] text-[#27a644] border border-[rgba(39,166,68,0.25)]",
        warning: "bg-[rgba(245,158,11,0.15)] text-[#f59e0b] border border-[rgba(245,158,11,0.25)]",
        error: "bg-[rgba(239,68,68,0.15)] text-[#ef4444] border border-[rgba(239,68,68,0.25)]",
        email: "bg-[rgba(255,128,31,0.15)] text-[#ff801f] border border-[rgba(255,128,31,0.25)]",
        outline: "border border-[#34343a] text-[#8a8f98]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
