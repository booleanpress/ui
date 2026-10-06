import { Label } from "@booleanpress/ui/label"
import { NativeSelect, NativeSelectOption } from "@booleanpress/ui/native-select"

export default function NativeSelectBasic() {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="encryption">Encryption</Label>
      <NativeSelect id="encryption" defaultValue="tls">
        <NativeSelectOption value="none">None</NativeSelectOption>
        <NativeSelectOption value="tls">TLS</NativeSelectOption>
        <NativeSelectOption value="ssl">SSL</NativeSelectOption>
      </NativeSelect>
    </div>
  )
}
