import { Input } from "@booleanpress/ui/input"
import { Label } from "@booleanpress/ui/label"

export default function LabelBasic() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Label htmlFor="from-name">From name</Label>
      <Input id="from-name" defaultValue="Acme Support" />
    </div>
  )
}
