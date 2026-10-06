import { PencilIcon, SettingsIcon, TrashIcon } from "lucide-react"
import { IconButton } from "@booleanpress/ui/icon-button"

export default function IconButtonBasic() {
  return (
    <div className="flex gap-2">
      <IconButton label="Edit mailer">
        <PencilIcon />
      </IconButton>
      <IconButton label="Mailer settings" variant="outline">
        <SettingsIcon />
      </IconButton>
      <IconButton label="Delete mailer" variant="default" severity="danger">
        <TrashIcon />
      </IconButton>
    </div>
  )
}
