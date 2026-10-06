import { CopyButton } from "@booleanpress/ui/copy-button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@booleanpress/ui/input-group"
import { Label } from "@booleanpress/ui/label"

const KEY = "bp_live_4f2a9c7e1d8b6053"

export default function CopyButtonInInputGroup() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Label htmlFor="api-key">API key</Label>
      <InputGroup>
        <InputGroupInput id="api-key" value={KEY} readOnly className="font-mono" />
        <InputGroupAddon align="inline-end">
          <CopyButton value={KEY} label="Copy API key" size="xs" />
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
