import { ExternalLinkIcon, PencilIcon, RotateCwIcon, Trash2Icon, UploadIcon } from "lucide-react"
import { SpeedDial, SpeedDialAction, SpeedDialContent, SpeedDialTrigger } from "@booleanpress/ui/speed-dial"

const ACTIONS = [
  { label: "Edit template", icon: PencilIcon },
  { label: "Retry failed emails", icon: RotateCwIcon },
  { label: "Delete template", icon: Trash2Icon },
  { label: "Import contacts", icon: UploadIcon },
  { label: "Open the delivery log", icon: ExternalLinkIcon },
]

// 0 opens every action at once; the default staggers them 30 ms apart; 80 makes the cascade easy to see.
const DIALS = [
  { delay: 0, place: "bottom-0 left-0", severity: "contrast" },
  { delay: 30, place: "bottom-0 left-1/2 -translate-x-1/2", severity: "success" },
  { delay: 80, place: "bottom-0 right-0", severity: "info" },
] as const

export default function SpeedDialTransitionDelay() {
  return (
    <div className="relative h-60 w-full max-w-lg">
      {DIALS.map((dial) => (
        <SpeedDial key={dial.delay} transitionDelay={dial.delay} className={`absolute ${dial.place}`}>
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
