import { Button } from "@booleanpress/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@booleanpress/ui/tooltip"

export default function TooltipOffset() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Side offset</Button>
        </TooltipTrigger>
        <TooltipContent sideOffset={12}>12 px above the button</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Align offset</Button>
        </TooltipTrigger>
        <TooltipContent align="start" alignOffset={24}>
          Starts 24 px in from the button’s edge
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
