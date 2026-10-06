import { CopyIcon, PencilIcon, TrashIcon } from "lucide-react"
import { Button } from "@booleanpress/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@booleanpress/ui/tooltip"

const ACTIONS = [
  { label: "Copy the key", icon: CopyIcon },
  { label: "Rename the key", icon: PencilIcon },
  { label: "Delete the key", icon: TrashIcon },
]

export default function TooltipIconRow() {
  return (
    <div className="flex gap-1">
      {ACTIONS.map(({ label, icon: Icon }) => (
        <Tooltip key={label}>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label={label}>
              <Icon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{label}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  )
}
