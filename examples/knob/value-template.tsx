import { Knob } from "@booleanpress/ui/knob"

export default function KnobValueTemplate() {
  return <Knob defaultValue={42} formatValue={(value) => `${value}%`} aria-label="Daily quota used" />
}
