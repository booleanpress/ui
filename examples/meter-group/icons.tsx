import { DatabaseBackupIcon, FileTextIcon, LayoutTemplateIcon, PaperclipIcon } from "lucide-react"
import { MeterGroup } from "@booleanpress/ui/meter-group"

const STORAGE = [
  { label: "Attachments", value: 16, color: "var(--chart-5)", icon: <PaperclipIcon /> },
  { label: "Logs", value: 8, color: "var(--chart-2)", icon: <FileTextIcon /> },
  { label: "Templates", value: 24, color: "var(--chart-4)", icon: <LayoutTemplateIcon /> },
  { label: "Backups", value: 10, color: "var(--chart-3)", icon: <DatabaseBackupIcon /> },
]

export default function MeterGroupIcons() {
  return <MeterGroup aria-label="Storage by type" values={STORAGE} className="w-full max-w-md" />
}
