import { MailIcon, SearchIcon } from "lucide-react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@booleanpress/ui/input-group"

export default function InputWithIcon() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <InputGroup>
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput aria-label="Search the email log" placeholder="Search" />
      </InputGroup>
      <InputGroup>
        <InputGroupInput aria-label="Reply-to address" defaultValue="support@example.com" />
        <InputGroupAddon align="inline-end">
          <MailIcon />
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
