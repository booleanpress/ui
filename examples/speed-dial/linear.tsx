import { ExternalLinkIcon, PencilIcon, RotateCwIcon, Trash2Icon, UploadIcon } from "lucide-react"
import { SpeedDial, SpeedDialAction, SpeedDialContent, SpeedDialTrigger } from "@booleanpress/ui/speed-dial"

const ACTIONS = [
  { label: "Edit template", icon: PencilIcon },
  { label: "Retry failed emails", icon: RotateCwIcon },
  { label: "Delete template", icon: Trash2Icon },
  { label: "Import contacts", icon: UploadIcon },
  { label: "Open the delivery log", icon: ExternalLinkIcon },
]

export default function SpeedDialLinear() {
  return (
    <div className="relative h-60 w-full max-w-lg">
      <SpeedDial className="absolute end-0 bottom-0">
        <SpeedDialTrigger />
        <SpeedDialContent>
          {ACTIONS.map((action) => (
            <SpeedDialAction key={action.label} label={action.label}>
              <action.icon />
            </SpeedDialAction>
          ))}
        </SpeedDialContent>
      </SpeedDial>
    </div>
  )
}
