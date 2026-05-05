"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-[#5e6ad2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#010102] disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-[#5e6ad2] text-white hover:bg-[#828fff] active:bg-[#4a56c4] shadow-[0_1px_3px_rgba(50,50,93,0.25),0_1px_0_rgba(0,0,0,0.1)]",
        secondary:
          "bg-[#141516] text-[#d0d6e0] border border-[#23252a] hover:bg-[#18191a] hover:border-[#34343a] active:bg-[#0f1011]",
        ghost:
          "text-[#8a8f98] hover:bg-[#141516] hover:text-[#d0d6e0]",
        outline:
          "border border-[#34343a] bg-transparent text-[#d0d6e0] hover:border-[#5e6ad2] hover:text-white hover:bg-[rgba(94,106,210,0.08)]",
        email:
          "bg-[#ff801f] text-white hover:bg-[#ff9444] active:bg-[#e06800] shadow-[0_1px_3px_rgba(50,50,93,0.25),0_1px_0_rgba(0,0,0,0.1)]",
        destructive:
          "bg-[rgba(239,68,68,0.15)] text-[#ef4444] border border-[rgba(239,68,68,0.3)] hover:bg-[rgba(239,68,68,0.25)]",
        link: "text-[#5e6ad2] underline-offset-4 hover:underline hover:text-[#828fff]",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-7 px-3 text-xs",
        lg: "h-11 px-6 text-base",
        icon: "size-9",
        "icon-sm": "size-7",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
