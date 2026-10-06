import { Input } from "@booleanpress/ui/input"
import { Label } from "@booleanpress/ui/label"

export default function InputClear() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Label htmlFor="log-filter">Filter the email log</Label>
      <Input id="log-filter" clearable defaultValue="invoice reminder" />
    </div>
  )
}
