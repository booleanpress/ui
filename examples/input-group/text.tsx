import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@booleanpress/ui/input-group"

export default function InputGroupTextExample() {
  return (
    <InputGroup attached className="max-w-sm">
      <InputGroupAddon>
        <InputGroupText>https://</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput aria-label="Tracking domain" placeholder="track" />
      <InputGroupAddon align="inline-end">
        <InputGroupText>.example.com</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  )
}
