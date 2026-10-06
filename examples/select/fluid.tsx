import { Label } from "@booleanpress/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@booleanpress/ui/select"

export default function SelectFluid() {
  return (
    <div className="flex w-full flex-col gap-2">
      <Label htmlFor="timezone-fluid">Time zone for the delivery report</Label>
      <Select>
        <SelectTrigger id="timezone-fluid" fluid>
          <SelectValue placeholder="Choose a time zone" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="utc">UTC</SelectItem>
          <SelectItem value="europe-london">Europe/London</SelectItem>
          <SelectItem value="america-new-york">America/New_York</SelectItem>
          <SelectItem value="asia-dhaka">Asia/Dhaka</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
