import { Button } from "@booleanpress/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@booleanpress/ui/tooltip"

export default function TooltipDelay() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Button variant="outline">Opens at once</Button>
        </TooltipTrigger>
        <TooltipContent>No delay on this one</TooltipContent>
      </Tooltip>
      <Tooltip delayDuration={1000}>
        <TooltipTrigger asChild>
          <Button variant="outline">Opens after 1 second</Button>
        </TooltipTrigger>
        <TooltipContent>Rest the pointer for a second</TooltipContent>
      </Tooltip>
    </div>
  )
}
