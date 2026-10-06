import { useState } from "react"
import { Button } from "@booleanpress/ui/button"
import { Label } from "@booleanpress/ui/label"
import { Switch } from "@booleanpress/ui/switch"
import { Tooltip, TooltipContent, TooltipTrigger } from "@booleanpress/ui/tooltip"

export default function TooltipControlled() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col items-center gap-4">
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger asChild>
          <Button variant="outline">Rotate the key</Button>
        </TooltipTrigger>
        {/* The switch below is outside the tooltip: keep a press on it from closing the tooltip first. */}
        <TooltipContent onPointerDownOutside={(event) => event.preventDefault()}>
          The old key stops working at once
        </TooltipContent>
      </Tooltip>
      <div className="flex items-center gap-2">
        <Switch id="show-key-tooltip" checked={open} onCheckedChange={setOpen} />
        <Label htmlFor="show-key-tooltip">Show the tooltip</Label>
      </div>
    </div>
  )
}
