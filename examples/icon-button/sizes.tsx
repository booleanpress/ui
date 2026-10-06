import { RefreshCwIcon } from "lucide-react"
import { IconButton } from "@booleanpress/ui/icon-button"

export default function IconButtonSizes() {
  return (
    <div className="flex items-center gap-2">
      {(["xs", "sm", "default", "lg"] as const).map((size) => (
        <IconButton key={size} label={`Refresh (${size})`} size={size} variant="outline">
          <RefreshCwIcon />
        </IconButton>
      ))}
    </div>
  )
}
