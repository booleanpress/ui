import { TriangleAlertIcon } from "lucide-react"
import { useState } from "react"
import { Button } from "@booleanpress/ui/button"
import { ConfirmPopup, ConfirmPopupContent, ConfirmPopupTrigger } from "@booleanpress/ui/confirm-popup"

export default function ConfirmPopupBasic() {
  const [saved, setSaved] = useState(false)

  return (
    <div className="flex flex-col items-center gap-3">
      <ConfirmPopup onConfirm={() => setSaved(true)}>
        <ConfirmPopupTrigger asChild>
          <Button variant="outline">Save</Button>
        </ConfirmPopupTrigger>
        <ConfirmPopupContent
          icon={<TriangleAlertIcon />}
          message="Save the changes to the Primary mailer?"
          confirmLabel="Save"
        />
      </ConfirmPopup>
      <p className="min-h-5 text-sm text-muted-foreground" aria-live="polite">
        {saved ? "Changes saved." : ""}
      </p>
    </div>
  )
}
