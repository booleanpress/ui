import { SearchIcon, UserIcon } from "lucide-react"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText } from "@booleanpress/ui/input-group"

export default function AttachedInputGroup() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <InputGroup attached>
        <InputGroupAddon><UserIcon aria-hidden="true" /></InputGroupAddon>
        <InputGroupInput aria-label="Username" placeholder="Username" />
      </InputGroup>
      <InputGroup attached>
        <InputGroupAddon><InputGroupText>$</InputGroupText></InputGroupAddon>
        <InputGroupInput aria-label="Price" inputMode="decimal" placeholder="Price" />
        <InputGroupAddon align="inline-end"><InputGroupText>.00</InputGroupText></InputGroupAddon>
      </InputGroup>
      <InputGroup attached>
        <InputGroupInput aria-label="Search records" placeholder="Keyword" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton variant="default" aria-label="Search"><SearchIcon aria-hidden="true" /></InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
