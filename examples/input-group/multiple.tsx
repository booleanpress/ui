import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@booleanpress/ui/input-group"

export default function InputGroupMultiple() {
  return (
    <InputGroup attached className="max-w-sm">
      <InputGroupAddon>
        <InputGroupText>$</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput aria-label="Monthly sending budget" inputMode="numeric" placeholder="250" />
      <InputGroupAddon align="inline-end">
        <InputGroupText>.00</InputGroupText>
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <InputGroupText>USD</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  )
}
