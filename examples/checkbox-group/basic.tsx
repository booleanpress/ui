import { CheckboxGroup, CheckboxGroupItem } from "@booleanpress/ui/checkbox-group"

export default function CheckboxGroupBasic() {
  return (
    <CheckboxGroup defaultValue={["delivered"]} aria-label="Log these events">
      <CheckboxGroupItem value="delivered" label="Delivered" />
      <CheckboxGroupItem value="opened" label="Opened" />
      <CheckboxGroupItem value="clicked" label="Clicked" />
      <CheckboxGroupItem value="bounced" label="Bounced" />
    </CheckboxGroup>
  )
}
