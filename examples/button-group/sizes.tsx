import { CheckIcon, Trash2Icon, XIcon } from "lucide-react"
import { Button } from "@booleanpress/ui/button"
import { ButtonGroup } from "@booleanpress/ui/button-group"

const SIZES = [
  { size: "sm", name: "Small" },
  { size: "default", name: "Default" },
  { size: "lg", name: "Large" },
] as const

export default function ButtonGroupSizes() {
  return (
    <div className="flex flex-col items-center gap-4">
      {SIZES.map(({ size, name }) => (
        <ButtonGroup key={size} aria-label={`Draft actions, ${name.toLowerCase()}`}>
          <Button size={size}>
            <CheckIcon />
            Save
          </Button>
          <Button size={size}>
            <Trash2Icon />
            Delete
          </Button>
          <Button size={size}>
            <XIcon />
            Cancel
          </Button>
        </ButtonGroup>
      ))}
    </div>
  )
}
