import { ItalicIcon } from "lucide-react"
import { Toggle } from "@booleanpress/ui/toggle"

export default function ToggleDisabled() {
  return (
    <div className="flex items-center gap-2">
      <Toggle disabled aria-label="Italic">
        <ItalicIcon />
      </Toggle>
      <Toggle disabled defaultPressed variant="outline">
        Archived
      </Toggle>
    </div>
  )
}
