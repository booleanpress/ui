import { Button } from "@booleanpress/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@booleanpress/ui/tooltip"

export default function TooltipDisabledTrigger() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span tabIndex={0} className="inline-flex rounded-md">
          <Button disabled className="pointer-events-none">
            Send email
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>Connect a mailer first</TooltipContent>
    </Tooltip>
  )
}
