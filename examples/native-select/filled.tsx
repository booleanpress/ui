import { Label } from "@booleanpress/ui/label"
import { NativeSelect, NativeSelectOption } from "@booleanpress/ui/native-select"

export default function NativeSelectFilled() {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="encryption-filled">Encryption</Label>
      <NativeSelect id="encryption-filled" variant="filled" defaultValue="tls">
        <NativeSelectOption value="none">None</NativeSelectOption>
        <NativeSelectOption value="tls">TLS</NativeSelectOption>
        <NativeSelectOption value="ssl">SSL</NativeSelectOption>
      </NativeSelect>
    </div>
  )
}
