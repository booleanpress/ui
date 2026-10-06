import { Label } from "@booleanpress/ui/label"
import { NativeSelect, NativeSelectOption } from "@booleanpress/ui/native-select"

export default function NativeSelectInvalid() {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="priority">Priority</Label>
      <NativeSelect id="priority" defaultValue="" aria-invalid aria-describedby="priority-error">
        <NativeSelectOption value="">Choose one</NativeSelectOption>
        <NativeSelectOption value="normal">Normal</NativeSelectOption>
        <NativeSelectOption value="urgent">Urgent</NativeSelectOption>
      </NativeSelect>
      <p id="priority-error" className="text-xs text-destructive-strong">
        Choose a priority.
      </p>
    </div>
  )
}
