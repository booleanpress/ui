import { InfoIcon } from "lucide-react"
import { useState } from "react"
import { Button } from "@booleanpress/ui/button"
import { ConfirmPopup, ConfirmPopupContent, ConfirmPopupTrigger } from "@booleanpress/ui/confirm-popup"

export default function ConfirmPopupDestructive() {
  const [deleted, setDeleted] = useState(false)

  return (
    <div className="flex flex-col items-center gap-3">
      <ConfirmPopup tone="destructive" onConfirm={() => setDeleted(true)}>
        <ConfirmPopupTrigger asChild>
          <Button variant="outline" severity="danger" disabled={deleted}>
            Delete entry
          </Button>
        </ConfirmPopupTrigger>
        <ConfirmPopupContent icon={<InfoIcon />} message="Delete this log entry?" />
      </ConfirmPopup>
      <p className="min-h-5 text-sm text-muted-foreground" aria-live="polite">
        {deleted ? "The entry was deleted." : ""}
      </p>
    </div>
  )
}
