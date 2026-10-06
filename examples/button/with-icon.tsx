import { MailIcon, SettingsIcon } from "lucide-react"
import { Button } from "@booleanpress/ui/button"

export default function ButtonWithIcon() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button>
        <MailIcon />
        Send a test email
      </Button>
      <Button variant="outline" size="icon-sm" aria-label="Settings">
        <SettingsIcon />
      </Button>
    </div>
  )
}
