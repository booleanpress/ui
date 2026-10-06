import { InFieldLabel } from "@booleanpress/ui/in-field-label"
import { Label } from "@booleanpress/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@booleanpress/ui/select"

export default function InFieldLabelWithSelect() {
  return (
    <InFieldLabel className="w-full max-w-sm">
      <Select defaultValue="weekly">
        <SelectTrigger id="ifl-digest" className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="daily">Every day</SelectItem>
          <SelectItem value="weekly">Every week</SelectItem>
          <SelectItem value="monthly">Every month</SelectItem>
        </SelectContent>
      </Select>
      <Label htmlFor="ifl-digest">Delivery report</Label>
    </InFieldLabel>
  )
}
