import { CheckIcon, PlusIcon, XIcon } from "lucide-react"
import { IconButton } from "@booleanpress/ui/icon-button"

export default function IconButtonRounded() {
  return (
    <div className="flex gap-2">
      <IconButton label="Add recipient" rounded variant="default">
        <PlusIcon />
      </IconButton>
      <IconButton label="Accept" rounded variant="outline" severity="success">
        <CheckIcon />
      </IconButton>
      <IconButton label="Decline" rounded variant="default" severity="danger" raised>
        <XIcon />
      </IconButton>
    </div>
  )
}
