import { Button } from "@booleanpress/ui/button"
import { ButtonGroup, ButtonGroupText } from "@booleanpress/ui/button-group"
import { Input } from "@booleanpress/ui/input"

export default function ButtonGroupWithTextAndInput() {
  return (
    <ButtonGroup className="w-full max-w-sm" aria-label="Test email">
      <ButtonGroupText>To</ButtonGroupText>
      <Input aria-label="Recipient" type="email" defaultValue="ops@example.com" />
      <Button variant="outline">Send</Button>
    </ButtonGroup>
  )
}
