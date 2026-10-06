import { Button } from "@booleanpress/ui/button"
import { ButtonGroup } from "@booleanpress/ui/button-group"

export default function ButtonGroupDisabled() {
  return (
    <ButtonGroup aria-label="Page navigation">
      <Button variant="outline" disabled>
        Previous
      </Button>
      <Button variant="outline">Next</Button>
    </ButtonGroup>
  )
}
