import { useState } from "react"
import { Button } from "@booleanpress/ui/button"
import { Popover, PopoverContent, PopoverDescription, PopoverTrigger } from "@booleanpress/ui/popover"

export default function PopoverControlled() {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">{open ? "Hide" : "Show"} the sending limit</Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverDescription>This connection sends up to 500 emails an hour.</PopoverDescription>
        <Button size="sm" className="mt-3" onClick={() => setOpen(false)}>
          Got it
        </Button>
      </PopoverContent>
    </Popover>
  )
}
