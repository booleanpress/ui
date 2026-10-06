import { MailIcon } from "lucide-react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@booleanpress/ui/input-group"

export default function InputGroupFilled() {
  return (
    <InputGroup className="max-w-sm" variant="filled">
      <InputGroupAddon>
        <MailIcon />
      </InputGroupAddon>
      <InputGroupInput aria-label="Bounce address" placeholder="bounces@example.com" />
    </InputGroup>
  )
}
