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

export default function MultiSelectDisabled() {
  return (
    <div className="flex w-full max-w-56 flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="multi-select-disabled">Alert channels</Label>
        <MultiSelect items={CHANNELS} defaultValue={["Email", "Slack"]} disabled>
          <MultiSelectTrigger id="multi-select-disabled" className="w-full">
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
      <div className="flex flex-col gap-2">
        <Label htmlFor="multi-select-option-disabled">Alert channels on the free plan</Label>
        <MultiSelect items={CHANNELS} defaultValue={["Email"]}>
          <MultiSelectTrigger id="multi-select-option-disabled" className="w-full">
            <MultiSelectValue placeholder="Choose channels" />
          </MultiSelectTrigger>
          <MultiSelectContent>
            <MultiSelectList>
              {(channel: string) => (
                <MultiSelectItem key={channel} value={channel} disabled={channel === "SMS" || channel === "Webhook"}>
                  {channel}
                </MultiSelectItem>
              )}
            </MultiSelectList>
          </MultiSelectContent>
        </MultiSelect>
      </div>
    </div>
  )
}
