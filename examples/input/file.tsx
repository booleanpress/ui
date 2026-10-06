import { Input } from "@booleanpress/ui/input"
import { Label } from "@booleanpress/ui/label"

export default function InputFile() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Label htmlFor="contacts-file">Contacts file</Label>
      <Input id="contacts-file" type="file" accept=".csv" />
    </div>
  )
}
