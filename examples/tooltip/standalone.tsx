import { Badge } from "@booleanpress/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@booleanpress/ui/tooltip"

export default function TooltipStandalone() {
  return (
    <p className="flex items-center gap-2 text-sm">
      Last delivery to hello@example.com:
      <Tooltip>
        <TooltipTrigger asChild>
          {/* Not a button, so it is put in the tab order: keyboard users reach the explanation too. */}
          <Badge variant="warning" tabIndex={0}>
            Soft bounce
          </Badge>
        </TooltipTrigger>
        <TooltipContent>The mailbox was full. It is retried in 1 hour.</TooltipContent>
      </Tooltip>
    </p>
  )
}
