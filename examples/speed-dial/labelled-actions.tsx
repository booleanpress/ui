import { CopyIcon, PrinterIcon, SaveIcon, Share2Icon } from "lucide-react"
import { SpeedDial, SpeedDialAction, SpeedDialContent, SpeedDialTrigger } from "@booleanpress/ui/speed-dial"

const ACTIONS = [
  { label: "Share report", icon: Share2Icon },
  { label: "Print", icon: PrinterIcon },
  { label: "Save as PDF", icon: SaveIcon },
  { label: "Copy link", icon: CopyIcon },
]

export default function SpeedDialLabelledActions() {
  return (
    <div className="relative h-72 w-full max-w-lg">
      <SpeedDial direction="down" className="absolute top-0 left-1/2 -translate-x-1/2">
        <SpeedDialTrigger severity="warning" />
        <SpeedDialContent className="items-stretch">
          {ACTIONS.map((action) => (
            // With its label visible, an action needs no tooltip.
            <SpeedDialAction key={action.label} label={action.label} tooltip={false} variant="outline" size="default" className="w-full justify-start">
              <action.icon /> {action.label}
            </SpeedDialAction>
          ))}
        </SpeedDialContent>
      </SpeedDial>
    </div>
  )
}
