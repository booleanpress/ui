import { useState } from "react"
import { Chip, ChipGroup } from "@booleanpress/ui/chip"

const RECIPIENTS = ["ops@example.com", "billing@example.com", "support@example.com", "alerts@example.com"]

export default function ChipGroupExample() {
  const [recipients, setRecipients] = useState(RECIPIENTS)

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <p id="chip-group-recipients" className="text-sm font-medium">
        Failure alerts go to
      </p>
      <ChipGroup aria-labelledby="chip-group-recipients">
        {recipients.map((address) => (
          <Chip
            key={address}
            label={address}
            onRemove={() => setRecipients((current) => current.filter((a) => a !== address))}
          />
        ))}
      </ChipGroup>
      {recipients.length === 0 ? <p className="text-sm text-muted-foreground">No one gets failure alerts.</p> : null}
    </div>
  )
}
