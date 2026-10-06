import { Knob } from "@booleanpress/ui/knob"

export default function KnobColours() {
  return (
    <div className="flex items-center gap-6">
      <Knob defaultValue={75} valueColor="var(--success)" rangeColor="var(--success-tag)" aria-label="Delivered" />
      <Knob defaultValue={12} valueColor="var(--destructive)" rangeColor="var(--destructive-tag)" aria-label="Bounced" />
      <Knob defaultValue={40} valueColor="var(--chart-2)" aria-label="Opened" />
    </div>
  )
}
