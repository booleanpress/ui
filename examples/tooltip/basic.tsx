import { Button } from "@booleanpress/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@booleanpress/ui/tooltip"

export default function TooltipBasic() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Send test email</Button>
      </TooltipTrigger>
      <TooltipContent>Sends to your own address</TooltipContent>
    </Tooltip>
  )
}
