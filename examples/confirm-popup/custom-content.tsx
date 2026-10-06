import { KeyRoundIcon } from "lucide-react"
import { Button } from "@booleanpress/ui/button"
import { ConfirmPopup, ConfirmPopupContent, ConfirmPopupTrigger } from "@booleanpress/ui/confirm-popup"

// Stands in for the request that issues a new key.
const regenerate = () => new Promise<void>((resolve) => setTimeout(resolve, 1200))

export default function ConfirmPopupCustomContent() {
  return (
    <ConfirmPopup onConfirm={regenerate}>
      <ConfirmPopupTrigger asChild>
        <Button variant="outline">
          <KeyRoundIcon />
          Regenerate key
        </Button>
      </ConfirmPopupTrigger>
      <ConfirmPopupContent confirmLabel="Regenerate">
        <div className="flex flex-col gap-1.5">
          <p className="font-medium text-foreground">Regenerate the Staging key?</p>
          <p className="text-muted-foreground">
            The key ending in <code className="rounded-sm bg-muted px-1 font-mono text-xs">7f3a</code> stops working.
          </p>
        </div>
      </ConfirmPopupContent>
    </ConfirmPopup>
  )
}
