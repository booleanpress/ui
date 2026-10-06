import { ExternalLinkIcon, PencilIcon, RotateCwIcon, Trash2Icon, UploadIcon } from "lucide-react"
import { SpeedDial, SpeedDialAction, SpeedDialContent, SpeedDialTrigger } from "@booleanpress/ui/speed-dial"

const ACTIONS = [
  { label: "Edit template", icon: PencilIcon },
  { label: "Retry failed emails", icon: RotateCwIcon },
  { label: "Delete template", icon: Trash2Icon },
  { label: "Import contacts", icon: UploadIcon },
  { label: "Open the delivery log", icon: ExternalLinkIcon },
]

// Each action shows its label on hover and focus; `tooltipSide` puts the labels on the side with room.
const DIALS = [
  { side: "right", place: "bottom-0 left-0", severity: "danger" },
  { side: "left", place: "bottom-0 right-0", severity: "help" },
] as const

export default function SpeedDialWithTooltips() {
  return (
    <div className="relative h-72 w-full max-w-lg">
      {DIALS.map((dial) => (
        <SpeedDial key={dial.side} tooltipSide={dial.side} className={`absolute ${dial.place}`}>
          <SpeedDialTrigger severity={dial.severity} />
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
