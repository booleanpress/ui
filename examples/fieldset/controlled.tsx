import { useState } from "react"
import { Button } from "@booleanpress/ui/button"
import { Fieldset, FieldsetContent, FieldsetLegend } from "@booleanpress/ui/fieldset"

export default function FieldsetControlled() {
  const [open, setOpen] = useState(true)

  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <div className="flex justify-center gap-2">
        <Button onClick={() => setOpen(true)}>Open</Button>
        <Button variant="secondary" onClick={() => setOpen(false)}>
          Close
        </Button>
      </div>
      <Fieldset toggleable open={open} onOpenChange={setOpen}>
        <FieldsetLegend>Bounce handling</FieldsetLegend>
        <FieldsetContent>
          <p className="p-2">
            Hard bounces add the address to the suppression list at once. Soft bounces are retried for 24 hours before the
            address is suppressed.
          </p>
        </FieldsetContent>
      </Fieldset>
    </div>
  )
}
