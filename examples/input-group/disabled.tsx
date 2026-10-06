import { MailIcon } from "lucide-react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@booleanpress/ui/input-group"

export default function InputGroupDisabled() {
  return (
    <InputGroup className="max-w-sm" data-disabled="true">
      <InputGroupInput aria-label="Sender" defaultValue="alerts@example.com" disabled />
      <InputGroupAddon>
        <MailIcon />
      </InputGroupAddon>
    </InputGroup>
  )
}
