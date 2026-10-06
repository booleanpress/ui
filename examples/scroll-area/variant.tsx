import { useState } from "react"
import { ScrollArea } from "@booleanpress/ui/scroll-area"
import { ToggleGroup, ToggleGroupItem } from "@booleanpress/ui/toggle-group"

type Visibility = "auto" | "hover" | "scroll" | "always"

const TYPES: { value: Visibility; label: string }[] = [
  { value: "auto", label: "Auto" },
  { value: "hover", label: "Hover" },
  { value: "scroll", label: "Scroll" },
  { value: "always", label: "Always" },
]
const EVENTS = Array.from({ length: 16 }, (_, i) => `Webhook ${2041 + i} delivered`)

export default function ScrollAreaVariant() {
  const [type, setType] = useState<Visibility>("auto")

  return (
    <div className="flex flex-col items-center gap-4">
      <ToggleGroup
        type="single"
        variant="outline"
        value={type}
        onValueChange={(next) => next && setType(next as Visibility)}
        aria-label="When the scrollbar shows"
      >
        {TYPES.map(({ value, label }) => (
          <ToggleGroupItem key={value} value={value}>
            {label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <ScrollArea type={type} className="h-64 w-56 rounded-md border">
        <ul className="flex flex-col gap-2 p-4 text-sm">
          {EVENTS.map((event) => (
            <li key={event}>{event}</li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  )
}
