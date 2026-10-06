import { Label } from "@booleanpress/ui/label"
import { NativeSelect, NativeSelectOption } from "@booleanpress/ui/native-select"

export default function NativeSelectDisabled() {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="locked-region">Region</Label>
      <NativeSelect id="locked-region" defaultValue="eu" disabled>
        <NativeSelectOption value="eu">Europe</NativeSelectOption>
        <NativeSelectOption value="us">United States</NativeSelectOption>
      </NativeSelect>
    </div>
  )
}
