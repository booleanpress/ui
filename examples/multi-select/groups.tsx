import { Label } from "@booleanpress/ui/label"
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectLabel,
  MultiSelectList,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@booleanpress/ui/multi-select"

const GROUPS = [
  { value: "Delivery", items: ["Delivered", "Deferred", "Bounced", "Failed"] },
  { value: "Engagement", items: ["Opened", "Clicked", "Unsubscribed", "Complained"] },
]

export default function MultiSelectGroups() {
  return (
    <div className="flex w-full max-w-56 flex-col gap-2">
      <Label htmlFor="multi-select-groups">Log these events</Label>
      <MultiSelect items={GROUPS} defaultValue={["Bounced", "Complained"]}>
        <MultiSelectTrigger id="multi-select-groups" className="w-full">
          <MultiSelectValue placeholder="Choose events" />
        </MultiSelectTrigger>
        <MultiSelectContent>
          <MultiSelectList>
            {(group: (typeof GROUPS)[number]) => (
              <MultiSelectGroup key={group.value} items={group.items}>
                <MultiSelectLabel>{group.value}</MultiSelectLabel>
                {group.items.map((event) => (
                  <MultiSelectItem key={event} value={event}>
                    {event}
                  </MultiSelectItem>
                ))}
              </MultiSelectGroup>
            )}
          </MultiSelectList>
        </MultiSelectContent>
      </MultiSelect>
    </div>
  )
}
