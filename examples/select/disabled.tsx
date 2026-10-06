import { Label } from "@booleanpress/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@booleanpress/ui/select"

export default function SelectDisabled() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="whole-disabled">Fallback mailer</Label>
        <Select disabled defaultValue="none">
          <SelectTrigger id="whole-disabled" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="ses">Amazon SES</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="item-disabled">Region</Label>
        <Select defaultValue="eu-west-1">
          <SelectTrigger id="item-disabled" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="eu-west-1">Europe (Ireland)</SelectItem>
            <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
            <SelectItem value="ap-south-1" disabled>
              Asia Pacific (Mumbai)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
