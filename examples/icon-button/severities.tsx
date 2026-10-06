import { BellIcon, CheckIcon, HeartIcon, InfoIcon, SearchIcon, TriangleAlertIcon, XIcon } from "lucide-react"
import { IconButton } from "@booleanpress/ui/icon-button"

const SEVERITIES = [
  { severity: undefined, label: "Search", icon: <SearchIcon /> },
  { severity: "success", label: "Approve", icon: <CheckIcon /> },
  { severity: "info", label: "Details", icon: <InfoIcon /> },
  { severity: "warning", label: "Notifications", icon: <BellIcon /> },
  { severity: "help", label: "Favourite", icon: <HeartIcon /> },
  { severity: "danger", label: "Reject", icon: <XIcon /> },
  { severity: "contrast", label: "Warnings", icon: <TriangleAlertIcon /> },
] as const

export default function IconButtonSeverities() {
  return (
    <div className="flex flex-col gap-3">
      {(["default", "outline", "ghost"] as const).map((variant) => (
        <div key={variant} className="flex flex-wrap gap-2">
          {SEVERITIES.map(({ severity, label, icon }) => (
            <IconButton key={label} label={`${label} (${variant})`} variant={variant} severity={severity}>
              {icon}
            </IconButton>
          ))}
        </div>
      ))}
    </div>
  )
}
