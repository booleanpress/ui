import { ExternalLinkIcon, PencilIcon, RotateCwIcon, Trash2Icon, UploadIcon } from "lucide-react"
import { SpeedDial, SpeedDialAction, SpeedDialContent, SpeedDialTrigger } from "@booleanpress/ui/speed-dial"

const ACTIONS = [
  { label: "Edit template", icon: PencilIcon },
  { label: "Retry failed emails", icon: RotateCwIcon },
  { label: "Delete template", icon: Trash2Icon },
  { label: "Import contacts", icon: UploadIcon },
  { label: "Open the delivery log", icon: ExternalLinkIcon },
]

const DIALS = [
  { direction: "up", place: "bottom-0 left-1/2 -translate-x-1/2" },
  { direction: "down", place: "top-0 left-1/2 -translate-x-1/2" },
  { direction: "left", place: "top-1/2 right-0 -translate-y-1/2" },
  { direction: "right", place: "top-1/2 left-0 -translate-y-1/2" },
] as const

export default function SpeedDialDirections() {
  return (
    <div className="relative h-[28rem] w-full max-w-xl">
      {DIALS.map((dial) => (
        <SpeedDial key={dial.direction} direction={dial.direction} className={`absolute ${dial.place}`}>
          <SpeedDialTrigger />
          <SpeedDialContent>
            {ACTIONS.map((action) => (
              <SpeedDialAction key={action.label} label={action.label}>
                <action.icon />
              </SpeedDialAction>
            ))}
          </SpeedDialContent>
        </SpeedDial>
      ))}
    </div>
  )
}
