import { ExternalLinkIcon, PencilIcon, RotateCwIcon, Trash2Icon, UploadIcon } from "lucide-react"
import { SpeedDial, SpeedDialAction, SpeedDialContent, SpeedDialTrigger } from "@booleanpress/ui/speed-dial"

const ACTIONS = [
  { label: "Edit template", icon: PencilIcon },
  { label: "Retry failed emails", icon: RotateCwIcon },
  { label: "Delete template", icon: Trash2Icon },
  { label: "Import contacts", icon: UploadIcon },
  { label: "Open the delivery log", icon: ExternalLinkIcon },
]

// Each dial sits in a corner and opens its quarter circle towards the middle.
const DIALS = [
  { direction: "down-right", place: "top-0 left-0" },
  { direction: "down-left", place: "top-0 right-0" },
  { direction: "up-right", place: "bottom-0 left-0" },
  { direction: "up-left", place: "bottom-0 right-0" },
] as const

export default function SpeedDialQuarterCircle() {
  return (
    <div className="relative h-[28rem] w-full max-w-xl">
      {DIALS.map((dial) => (
        <SpeedDial key={dial.direction} type="quarter-circle" direction={dial.direction} className={`absolute ${dial.place}`}>
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
