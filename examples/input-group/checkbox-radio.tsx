import { Checkbox } from "@booleanpress/ui/checkbox"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@booleanpress/ui/input-group"
import { RadioGroup, RadioGroupItem } from "@booleanpress/ui/radio-group"

export default function InputGroupCheckboxRadio() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <InputGroup>
        <InputGroupAddon>
          <Checkbox aria-label="Send a copy of every email" defaultChecked />
        </InputGroupAddon>
        <InputGroupInput aria-label="Copy address" defaultValue="archive@example.com" />
      </InputGroup>
      <RadioGroup aria-label="Default connection" defaultValue="smtp" className="gap-4">
        <InputGroup>
          <InputGroupInput aria-label="SMTP host" defaultValue="smtp.example.com" />
          <InputGroupAddon align="inline-end">
            <RadioGroupItem value="smtp" aria-label="Send through SMTP by default" />
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput aria-label="API endpoint" defaultValue="api.example.com" />
          <InputGroupAddon align="inline-end">
            <RadioGroupItem value="api" aria-label="Send through the API by default" />
          </InputGroupAddon>
        </InputGroup>
      </RadioGroup>
    </div>
  )
}
