import { Button } from "@booleanpress/ui/button"
import { ButtonGroup } from "@booleanpress/ui/button-group"

export default function ButtonGroupVertical() {
  return (
    <ButtonGroup orientation="vertical" aria-label="Mailer actions">
      <Button variant="outline">Send test email</Button>
      <Button variant="outline">Duplicate</Button>
      <Button variant="outline">Disable</Button>
    </ButtonGroup>
  )
}
