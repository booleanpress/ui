import { MeterGroup } from "@booleanpress/ui/meter-group"

const STORAGE = [
  { label: "Attachments", value: 16, color: "var(--chart-5)" },
  { label: "Logs", value: 8, color: "var(--chart-2)" },
  { label: "Templates", value: 24, color: "var(--chart-4)" },
  { label: "Backups", value: 10, color: "var(--chart-3)" },
]

export default function MeterGroupMultiple() {
  return <MeterGroup aria-label="Storage by type" values={STORAGE} className="w-full max-w-md" />
}
