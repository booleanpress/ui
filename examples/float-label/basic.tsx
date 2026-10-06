import { MailIcon } from "lucide-react"
import { FloatLabel } from "@booleanpress/ui/float-label"
import { Input } from "@booleanpress/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@booleanpress/ui/input-group"
import { Label } from "@booleanpress/ui/label"

export default function FloatLabelBasic() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-8 pt-4.5">
      <FloatLabel>
        <Input id="fl-from-name" />
        <Label htmlFor="fl-from-name">From name</Label>
      </FloatLabel>
      <FloatLabel>
        <InputGroup>
          <InputGroupInput id="fl-from-email" defaultValue="support@example.com" />
          <InputGroupAddon>
            <MailIcon />
          </InputGroupAddon>
        </InputGroup>
        <Label htmlFor="fl-from-email">From email</Label>
      </FloatLabel>
    </div>
  )
}
