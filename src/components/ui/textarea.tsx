import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-[#23252a] bg-[#141516] px-3 py-2 text-sm text-[#f7f8f8]",
          "placeholder:text-[#62666d] leading-relaxed",
          "resize-none transition-colors duration-150",
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
Textarea.displayName = "Textarea"

export { Textarea }
