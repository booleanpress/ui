import { InputGroup, InputGroupAddon, InputGroupInput } from "@booleanpress/ui/input-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@booleanpress/ui/select"

export default function InputGroupSelect() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <InputGroup>
        <InputGroupAddon>
          <Select defaultValue="post">
            <SelectTrigger aria-label="Request method">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="post">POST</SelectItem>
              <SelectItem value="put">PUT</SelectItem>
            </SelectContent>
          </Select>
        </InputGroupAddon>
        <InputGroupInput aria-label="Webhook URL" placeholder="https://example.com/hooks" />
      </InputGroup>
      <InputGroup>
        <InputGroupInput aria-label="Sending limit" inputMode="numeric" defaultValue="500" />
        <InputGroupAddon align="inline-end">
          <Select defaultValue="hour">
            <SelectTrigger aria-label="Limit period">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hour">emails per hour</SelectItem>
              <SelectItem value="day">emails per day</SelectItem>
            </SelectContent>
          </Select>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
