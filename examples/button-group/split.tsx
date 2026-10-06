import { ChevronDown } from "lucide-react"
import { Button } from "@booleanpress/ui/button"
import { ButtonGroup, ButtonGroupSeparator } from "@booleanpress/ui/button-group"

export default function ButtonGroupSplit() {
  return (
    <ButtonGroup aria-label="Save options">
      <Button variant="secondary">Save</Button>
      <ButtonGroupSeparator />
      <Button variant="secondary" size="icon" aria-label="More save options">
        <ChevronDown />
      </Button>
    </ButtonGroup>
  )
}
