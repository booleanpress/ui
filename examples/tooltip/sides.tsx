import { Button } from "@booleanpress/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@booleanpress/ui/tooltip"

const SIDES = ["top", "right", "bottom", "left"] as const

export default function TooltipSides() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {SIDES.map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger asChild>
            <Button variant="outline" className="capitalize">
              {side}
            </Button>
          </TooltipTrigger>
          <TooltipContent side={side}>On the {side}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  )
}
