import { Label } from "@booleanpress/ui/label"
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectList,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@booleanpress/ui/multi-select"

const CHANNELS = ["Email", "SMS", "Slack", "Webhook"]

export default function MultiSelectFilled() {
  return (
    <div className="flex w-full max-w-56 flex-col gap-2">
      <Label htmlFor="multi-select-channels">Alert channels</Label>
      <MultiSelect items={CHANNELS}>
        <MultiSelectTrigger id="multi-select-channels" variant="filled" className="w-full">
          <MultiSelectValue placeholder="Choose channels" />
        </MultiSelectTrigger>
        <MultiSelectContent>
          <MultiSelectList>
            {(channel: string) => (
              <MultiSelectItem key={channel} value={channel}>
                {channel}
              </MultiSelectItem>
            )}
          </MultiSelectList>
        </MultiSelectContent>
      </MultiSelect>
    </div>
  )
}
