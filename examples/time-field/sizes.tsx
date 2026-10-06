import { TimeField } from "@booleanpress/ui/time-field"

const time = new Date(2026, 9, 14, 9, 30)

export default function TimeFieldSizes() {
  return (
    <div className="flex flex-col items-center gap-3">
      <TimeField size="sm" aria-label="Small" defaultValue={time} />
      <TimeField aria-label="Default" defaultValue={time} />
      <TimeField size="lg" aria-label="Large" defaultValue={time} />
    </div>
  )
}
