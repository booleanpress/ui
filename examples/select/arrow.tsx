import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@booleanpress/ui/select"

export default function SelectArrowExample() {
  return <Select defaultValue="weekly">
    <SelectTrigger aria-label="Frequency"><SelectValue /></SelectTrigger>
    <SelectContent arrow sideOffset={8}>
      <SelectItem value="daily">Daily</SelectItem>
      <SelectItem value="weekly">Weekly</SelectItem>
      <SelectItem value="monthly">Monthly</SelectItem>
    </SelectContent>
  </Select>
}
