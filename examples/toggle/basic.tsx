import { BoldIcon } from "lucide-react"
import { Toggle } from "@booleanpress/ui/toggle"

export default function ToggleBasic() {
  return (
    <div className="flex items-center gap-2">
      <Toggle aria-label="Bold">
        <BoldIcon />
      </Toggle>
      <Toggle defaultPressed>Pinned</Toggle>
    </div>
  )
}
