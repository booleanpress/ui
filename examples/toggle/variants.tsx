import { StarIcon } from "lucide-react"
import { Toggle } from "@booleanpress/ui/toggle"

export default function ToggleVariants() {
  return (
    <div className="flex flex-col items-start gap-3">
      <div className="flex items-center gap-2">
        <Toggle aria-label="Star, default" defaultPressed>
          <StarIcon />
          Star
        </Toggle>
        <Toggle variant="outline" aria-label="Star, outline" defaultPressed>
          <StarIcon />
          Star
        </Toggle>
      </div>
      <div className="flex items-center gap-2">
        <Toggle variant="outline" size="sm">
          Small
        </Toggle>
        <Toggle variant="outline">Default</Toggle>
        <Toggle variant="outline" size="lg">
          Large
        </Toggle>
      </div>
    </div>
  )
}
