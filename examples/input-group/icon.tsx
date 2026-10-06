import { SearchIcon } from "lucide-react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@booleanpress/ui/input-group"

export default function InputGroupIcon() {
  return (
    <InputGroup className="max-w-sm">
      <InputGroupInput aria-label="Search the email log" placeholder="Search the email log" />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
    </InputGroup>
  )
}
