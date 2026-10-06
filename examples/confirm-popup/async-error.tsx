import { TriangleAlertIcon } from "lucide-react"
import { Button } from "@booleanpress/ui/button"
import { ConfirmPopup, ConfirmPopupContent, ConfirmPopupTrigger } from "@booleanpress/ui/confirm-popup"

// A pretend request that fails after 800 ms: the popup keeps its spinner until then, then stays open with the message.
const publish = () =>
  new Promise<void>((_, reject) => {
    setTimeout(() => reject(new Error("Acme Mail could not be reached. Try again in a minute.")), 800)
  })

export default function ConfirmPopupAsyncError() {
  return (
    <ConfirmPopup onConfirm={publish}>
      <ConfirmPopupTrigger asChild>
        <Button variant="outline">Publish</Button>
      </ConfirmPopupTrigger>
      <ConfirmPopupContent
        icon={<TriangleAlertIcon />}
        message="Publish the Welcome template to all subscribers?"
        confirmLabel="Publish"
      />
    </ConfirmPopup>
  )
}
