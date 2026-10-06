import { MailIcon } from "lucide-react"
import { InFieldLabel } from "@booleanpress/ui/in-field-label"
import { Input } from "@booleanpress/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@booleanpress/ui/input-group"
import { Label } from "@booleanpress/ui/label"

export default function InFieldLabelBasic() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <InFieldLabel>
        <Input id="ifl-from-name" defaultValue="Acme Support" />
        <Label htmlFor="ifl-from-name">From name</Label>
      </InFieldLabel>
      <InFieldLabel>
        <InputGroup>
          <InputGroupInput id="ifl-from-email" placeholder="support@example.com" />
          <InputGroupAddon>
            <MailIcon />
          </InputGroupAddon>
        </InputGroup>
        <Label htmlFor="ifl-from-email">From email</Label>
      </InFieldLabel>
    </div>
  )
}
