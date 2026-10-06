import { ChevronDownIcon } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@booleanpress/ui/collapsible"

export default function CollapsibleDisabled() {
  return (
    <Collapsible disabled className="w-full max-w-sm rounded-md border bg-card text-card-foreground">
      <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 rounded-md p-4 text-start text-sm font-semibold outline-none focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60">
        Routing rules
        <ChevronDownIcon aria-hidden="true" className="size-3.5 shrink-0" />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pb-4 text-sm text-muted-foreground">Hidden while disabled.</CollapsibleContent>
    </Collapsible>
  )
}
