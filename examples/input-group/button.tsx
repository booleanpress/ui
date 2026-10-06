import { useState } from "react"
import { CheckIcon, CopyIcon } from "lucide-react"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@booleanpress/ui/input-group"

export default function InputGroupButtonExample() {
  const [copied, setCopied] = useState(false)

  return (
    <InputGroup className="max-w-sm">
      <InputGroupInput aria-label="Webhook URL" defaultValue="https://example.com/hooks/delivery" readOnly />
      <InputGroupAddon align="inline-end">
        <InputGroupButton aria-label={copied ? "Copied" : "Copy the webhook URL"} size="icon-xs" onClick={() => setCopied(true)}>
          {copied ? <CheckIcon /> : <CopyIcon />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}
