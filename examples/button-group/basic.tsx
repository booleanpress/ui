import { Button } from "@booleanpress/ui/button"
import { ButtonGroup } from "@booleanpress/ui/button-group"

export default function ButtonGroupBasic() {
  return (
    <ButtonGroup aria-label="Log period">
      <Button variant="outline">Today</Button>
      <Button variant="outline">7 days</Button>
      <Button variant="outline">30 days</Button>
    </ButtonGroup>
  )
}
