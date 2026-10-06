import { MailIcon } from "lucide-react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@booleanpress/ui/input-group"

export default function InputGroupInvalid() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-1.5">
      <InputGroup>
        <InputGroupInput aria-label="Recipient" defaultValue="sam@" aria-invalid aria-describedby="recipient-error" />
        <InputGroupAddon>
          <MailIcon />
        </InputGroupAddon>
      </InputGroup>
      <p id="recipient-error" className="text-xs text-destructive-strong">
        Enter a full email address.
      </p>
    </div>
  )
}
