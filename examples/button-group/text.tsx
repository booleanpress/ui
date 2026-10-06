import { CheckIcon, ChevronDownIcon } from "lucide-react"
import { Button } from "@booleanpress/ui/button"
import { ButtonGroup } from "@booleanpress/ui/button-group"

const SEVERITIES = [undefined, "success", "info", "warning", "help", "danger", "contrast"] as const

export default function ButtonGroupTextButtons() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {SEVERITIES.map((severity) => (
        <ButtonGroup key={severity ?? "primary"} aria-label={`Save options, ${severity ?? "primary"}`}>
          <Button variant="ghost" severity={severity}>
            <CheckIcon />
            Save
          </Button>
          <Button variant="ghost" severity={severity} size="icon" aria-label={`More save options, ${severity ?? "primary"}`}>
            <ChevronDownIcon />
          </Button>
        </ButtonGroup>
      ))}
    </div>
  )
}
