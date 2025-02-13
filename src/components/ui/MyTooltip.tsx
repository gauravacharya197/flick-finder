import * as React from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TooltipArrow,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface MyTooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
  delayDuration?: number
  className?: string
}

const MyTooltip = ({
  content,
  children,
  side = "top",
  align = "center",
  delayDuration = 200,
  className,
}: MyTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={delayDuration}>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          className={cn(
            "bg-[#000000d9] text-white",
            "border-none",
            "shadow-lg shadow-[#000000d9]",
            "rounded-md px-3 py-1.5",
            "text-sm font-medium",
            "animate-in fade-in-0 zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            "data-[side=bottom]:slide-in-from-top-2",
            "data-[side=left]:slide-in-from-right-2",
            "data-[side=right]:slide-in-from-left-2",
            "data-[side=top]:slide-in-from-bottom-2",
            className
          )}
        >
          {content}
          <TooltipArrow className="fill-[#000000d9] h-2 w-5" />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export { MyTooltip }