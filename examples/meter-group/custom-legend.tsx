import { DatabaseBackupIcon, FileTextIcon, LayoutTemplateIcon, PaperclipIcon } from "lucide-react"
import { MeterGroup, MeterGroupMeters } from "@booleanpress/ui/meter-group"
import { useUiLocale } from "@booleanpress/ui/provider"

const STORAGE = [
  { label: "Attachments", value: 50, color: "var(--chart-5)", Icon: PaperclipIcon },
  { label: "Logs", value: 30, color: "var(--chart-2)", Icon: FileTextIcon },
  { label: "Templates", value: 40, color: "var(--chart-4)", Icon: LayoutTemplateIcon },
  { label: "Backups", value: 20, color: "var(--chart-3)", Icon: DatabaseBackupIcon },
]

export default function MeterGroupCustomLegend() {
  const { locale } = useUiLocale()
  const gigabytes = new Intl.NumberFormat(locale, { style: "unit", unit: "gigabyte" })
  const used = STORAGE.reduce((sum, item) => sum + item.value, 0)

  return (
    <MeterGroup aria-label="Storage, of 200 GB" values={STORAGE} max={200} formatValue={(value) => gigabytes.format(value)} className="w-full max-w-sm">
      <ul aria-hidden="true" className="grid grid-cols-2 gap-3.5">
        {STORAGE.map(({ label, value, color, Icon }) => (
          <li key={label} className="flex items-start justify-between gap-2 rounded-xl border bg-card p-4.5 shadow-sm">
            <span className="flex flex-col gap-1">
              <span className="text-muted-foreground">{label}</span>
              <span className="text-lg/7 font-bold">{gigabytes.format(value)}</span>
            </span>
            <Icon className="size-4" style={{ color }} />
          </li>
        ))}
      </ul>
      <div className="flex justify-between text-muted-foreground">
        <span>Storage</span>
        <span>
          {gigabytes.format(used)} / {gigabytes.format(200)}
        </span>
      </div>
      <MeterGroupMeters />
    </MeterGroup>
  )
}
