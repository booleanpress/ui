import { useState } from "react"
import { Label } from "@booleanpress/ui/label"
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectList,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@booleanpress/ui/multi-select"

const STATUSES = ["Open", "Pending", "On hold", "Solved", "Closed"]

export default function MultiSelectClear() {
  const [statuses, setStatuses] = useState(["Open", "Pending"])

  return (
    <div className="flex w-full max-w-56 flex-col gap-2">
      <Label htmlFor="multi-select-status">Ticket status</Label>
      <MultiSelect items={STATUSES} value={statuses} onValueChange={setStatuses}>
        <MultiSelectTrigger id="multi-select-status" clearable className="w-full">
          <MultiSelectValue placeholder="Any status" />
        </MultiSelectTrigger>
        <MultiSelectContent>
          <MultiSelectList>
            {(status: string) => (
              <MultiSelectItem key={status} value={status}>
                {status}
              </MultiSelectItem>
            )}
          </MultiSelectList>
        </MultiSelectContent>
      </MultiSelect>
      <p className="text-xs text-muted-foreground">
        {statuses.length ? `Showing ${statuses.length} of ${STATUSES.length} statuses.` : "Showing every ticket."}
      </p>
    </div>
  )
}
