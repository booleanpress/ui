import { CheckboxGroup, CheckboxGroupItem } from "@booleanpress/ui/checkbox-group"

export default function CheckboxGroupHorizontal() {
  return (
    <CheckboxGroup orientation="horizontal" defaultValue={["mon", "tue", "wed", "thu", "fri"]} aria-label="Sending days">
      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
        <CheckboxGroupItem key={day} value={day.toLowerCase()} label={day} />
      ))}
    </CheckboxGroup>
  )
}
