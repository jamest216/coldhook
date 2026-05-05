import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-[#23252a] bg-[#141516] px-3 py-1 text-sm text-[#f7f8f8]",
          "placeholder:text-[#62666d]",
          "transition-colors duration-150",
          "focus:outline-none focus:border-[#5e6ad2] focus:ring-2 focus:ring-[rgba(94,106,210,0.2)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
