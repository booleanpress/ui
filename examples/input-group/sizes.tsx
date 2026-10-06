import { SearchIcon } from "lucide-react"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@booleanpress/ui/input-group"

export default function InputGroupSizes() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <InputGroup size="sm">
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput aria-label="Search, small" placeholder="Small" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>12 results</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput aria-label="Search, normal" placeholder="Normal" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>12 results</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup size="lg">
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput aria-label="Search, large" placeholder="Large" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>12 results</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
