import { Input } from "@booleanpress/ui/input"
import { Label } from "@booleanpress/ui/label"

export default function InputBasic() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Label htmlFor="sender-email">Sender email</Label>
      <Input id="sender-email" type="email" placeholder="alerts@example.com" />
    </div>
  )
}
