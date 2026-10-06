import { DateField } from "@booleanpress/ui/date-field"

const day = new Date(2026, 9, 14)

export default function DateFieldSizes() {
  return (
    <div className="flex flex-col items-center gap-3">
      <DateField size="sm" aria-label="Small" defaultValue={day} />
      <DateField aria-label="Default" defaultValue={day} />
      <DateField size="lg" aria-label="Large" defaultValue={day} />
    </div>
  )
}
