import { FloatLabel } from "@booleanpress/ui/float-label"
import { Label } from "@booleanpress/ui/label"
import { NativeSelect, NativeSelectOption } from "@booleanpress/ui/native-select"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@booleanpress/ui/select"

export default function FloatLabelWithSelect() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-8 pt-4.5">
      <FloatLabel>
        <Select>
          <SelectTrigger id="fl-provider" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="smtp">Other SMTP</SelectItem>
            <SelectItem value="ses">Amazon SES</SelectItem>
            <SelectItem value="mailgun">Mailgun</SelectItem>
          </SelectContent>
        </Select>
        <Label htmlFor="fl-provider">Email provider</Label>
      </FloatLabel>
      <FloatLabel variant="in">
        <NativeSelect id="fl-encryption" defaultValue="tls" className="w-60">
          <NativeSelectOption value="" />
          <NativeSelectOption value="tls">TLS</NativeSelectOption>
          <NativeSelectOption value="ssl">SSL</NativeSelectOption>
        </NativeSelect>
        <Label htmlFor="fl-encryption">Encryption</Label>
      </FloatLabel>
    </div>
  )
}
