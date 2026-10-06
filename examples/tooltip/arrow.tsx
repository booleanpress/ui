import { Button } from "@booleanpress/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@booleanpress/ui/tooltip"

export default function TooltipArrow() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">With an arrow</Button>
        </TooltipTrigger>
        <TooltipContent>Points at the button it describes</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Without an arrow</Button>
        </TooltipTrigger>
        <TooltipContent arrow={false} sideOffset={4}>
          A plain label, 4 px away
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
