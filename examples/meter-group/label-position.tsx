import { MeterGroup } from "@booleanpress/ui/meter-group"

const SENDS = [
  { label: "Delivered", value: 72, color: "var(--success)" },
  { label: "Deferred", value: 9, color: "var(--warning-solid)" },
  { label: "Bounced", value: 4, color: "var(--destructive)" },
]

export default function MeterGroupLabelPosition() {
  return (
    <div className="flex w-full max-w-md flex-col gap-10">
      <MeterGroup aria-label="Today's sends, legend first" values={SENDS} labelPosition="start" />
      <MeterGroup aria-label="Today's sends, legend in a column" values={SENDS} labelOrientation="vertical" />
    </div>
  )
}
