import { CheckIcon, ChevronDownIcon } from "lucide-react"
import { Button } from "@booleanpress/ui/button"
import { ButtonGroup } from "@booleanpress/ui/button-group"

const GROUPS = [
  { name: "Primary", props: {} },
  { name: "Secondary", props: { variant: "secondary" } },
  { name: "Success", props: { severity: "success" } },
  { name: "Info", props: { severity: "info" } },
  { name: "Warning", props: { severity: "warning" } },
  { name: "Help", props: { severity: "help" } },
  { name: "Danger", props: { severity: "danger" } },
  { name: "Contrast", props: { severity: "contrast" } },
] as const

export default function ButtonGroupSeverities() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {GROUPS.map(({ name, props }) => (
        <ButtonGroup key={name} aria-label={`${name} save options`}>
          <Button {...props}>
            <CheckIcon />
            Save
          </Button>
          <Button {...props} size="icon" aria-label={`More save options, ${name.toLowerCase()}`}>
            <ChevronDownIcon />
          </Button>
        </ButtonGroup>
      ))}
    </div>
  )
}
