import { SearchIcon, LoaderCircleIcon, UserIcon } from "lucide-react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@booleanpress/ui/input-group"

export default function IconArrangements() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <InputGroup>
        <InputGroupAddon><UserIcon aria-hidden="true" /></InputGroupAddon>
        <InputGroupInput aria-label="Find a person" placeholder="Search people" clearable />
        <InputGroupAddon align="inline-end"><SearchIcon aria-hidden="true" /></InputGroupAddon>
      </InputGroup>
      <InputGroup size="sm">
        <InputGroupInput aria-label="Loading suggestions" aria-busy placeholder="Loading" />
        <InputGroupAddon align="inline-end"><LoaderCircleIcon className="animate-spin" aria-hidden="true" /></InputGroupAddon>
      </InputGroup>
      <InputGroup size="lg">
        <InputGroupAddon><SearchIcon aria-hidden="true" /></InputGroupAddon>
        <InputGroupInput aria-label="Large search" placeholder="Search" />
      </InputGroup>
    </div>
  )
}
