import * as React from "react"
import { cn } from "@/lib/utils"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

interface SegmentedProps {
  size?: "small" | "medium" | "large"
  value: string
  options: string[]
  onChange?: (value: string) => void
  className?: string
}

const Segmented = React.forwardRef<HTMLDivElement, SegmentedProps>(
  ({ size = "medium", value, options, onChange, className }, ref) => {
    const sizeClasses = {
      small: "h-7 text-sm",
      medium: "h-8 text-sm",
      large: "h-9 text-sm"
    }

    return (
      <ToggleGroup
        ref={ref}
        type="single"
        value={value}
        onValueChange={onChange}
        className={cn(
          "inline-flex bg-gray-800 rounded-sm overflow-hidden p-0",
          className
        )}
      >
        {options.map((option) => (
          <ToggleGroupItem
            key={option}
            value={option}
            className={cn(
              "flex-1 px-4",
              "data-[state=on]:bg-primary data-[state=on]:text-white",
              "data-[state=off]:text-white",
              "transition-colors duration-200",
              "rounded-none",
              sizeClasses[size]
            )}
          >
            {option}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    )
  }
)

Segmented.displayName = "Segmented"

export { Segmented }
export type { SegmentedProps }