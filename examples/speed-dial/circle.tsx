import {
  ExternalLinkIcon,
  HeartIcon,
  PencilIcon,
  RotateCwIcon,
  SettingsIcon,
  Trash2Icon,
  UploadIcon,
  UserIcon,
} from "lucide-react"
import { SpeedDial, SpeedDialAction, SpeedDialContent, SpeedDialTrigger } from "@booleanpress/ui/speed-dial"

const ACTIONS = [
  { label: "Edit template", icon: PencilIcon },
  { label: "Retry failed emails", icon: RotateCwIcon },
  { label: "Delete template", icon: Trash2Icon },
  { label: "Import contacts", icon: UploadIcon },
  { label: "Open the delivery log", icon: ExternalLinkIcon },
  { label: "Settings", icon: SettingsIcon },
  { label: "Assign to me", icon: UserIcon },
  { label: "Add to favourites", icon: HeartIcon },
]

export default function SpeedDialCircle() {
  return (
    <div className="relative h-80 w-full max-w-lg">
      <SpeedDial type="circle" className="absolute top-1/2 left-1/2 -translate-1/2">
        <SpeedDialTrigger severity="warning" />
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
