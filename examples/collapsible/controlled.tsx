import { useState } from "react"
import { ChevronDownIcon } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@booleanpress/ui/collapsible"

export default function CollapsibleControlled() {
  const [open, setOpen] = useState(true)

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="w-full max-w-sm rounded-md border bg-card text-card-foreground"
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 rounded-md p-4 text-start text-sm font-semibold outline-none focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring [&[data-state=open]>svg]:rotate-180">
        {open ? "Hide" : "Show"} the test email details
        <ChevronDownIcon aria-hidden="true" className="size-3.5 shrink-0 transition-transform duration-200" />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pb-4 text-sm text-muted-foreground">
        Sent to ops@example.com through Amazon SES at 10:42.
      </CollapsibleContent>
    </Collapsible>
  )
}
