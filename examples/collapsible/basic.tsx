import { ChevronDownIcon } from "lucide-react"
import { Button } from "@booleanpress/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@booleanpress/ui/collapsible"

export default function CollapsibleBasic() {
  return (
    <Collapsible className="w-full max-w-sm rounded-md border bg-card text-card-foreground">
      <div className="flex items-center justify-between gap-2 px-4 py-1.5">
        <h4 className="text-sm font-semibold">Advanced SMTP settings</h4>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle advanced settings"
            className="rounded-full [&[data-state=open]>svg]:rotate-180"
          >
            <ChevronDownIcon className="size-3.5 transition-transform duration-200" />
          </Button>
        </CollapsibleTrigger>
      </div>
      <div className="flex flex-col gap-3 px-4 pb-4 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Host</span>
          <span>smtp.example.com</span>
        </div>
        <CollapsibleContent className="flex flex-col gap-3">
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Port</span>
            <span>587</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Encryption</span>
            <span>STARTTLS</span>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}
