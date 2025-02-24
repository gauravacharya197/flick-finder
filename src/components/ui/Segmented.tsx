import * as React from "react"
import { cn } from "@/lib/utils"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/primitives/toggle-group"

interface SegmentedOption {
  value: string;
  label: string;
}

interface SegmentedProps {
  size?: "small" | "medium" | "large"
  value: string
  options: (string | SegmentedOption)[]
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

    const renderOption = (option: string | SegmentedOption) => {
      const value = typeof option === 'string' ? option : option.value;
      const label = typeof option === 'string' ? option : option.label;

      return (
        <ToggleGroupItem
          key={value}
          value={value}
          className={cn(
            "flex-1 px-4",
            "data-[state=on]:bg-primary data-[state=on]:text-white",
            "data-[state=off]:text-white",
            "transition-colors duration-200",
            "rounded-none",
            sizeClasses[size]
          )}
        >
          {label}
        </ToggleGroupItem>
      );
    };

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
        {options.map(renderOption)}
      </ToggleGroup>
    )
  }
)

Segmented.displayName = "Segmented"

export { Segmented }
export type { SegmentedProps, SegmentedOption }