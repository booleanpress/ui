import { Label } from "@booleanpress/ui/label"
import { NativeSelect, NativeSelectOption } from "@booleanpress/ui/native-select"

export default function NativeSelectFluid() {
  return (
    <div className="flex w-full flex-col gap-2">
      <Label htmlFor="retention-fluid">Keep the email log for</Label>
      <NativeSelect id="retention-fluid" fluid defaultValue="30">
        <NativeSelectOption value="7">7 days</NativeSelectOption>
        <NativeSelectOption value="30">30 days</NativeSelectOption>
        <NativeSelectOption value="90">90 days</NativeSelectOption>
        <NativeSelectOption value="365">One year</NativeSelectOption>
      </NativeSelect>
    </div>
  )
}
