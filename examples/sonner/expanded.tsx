import { toast } from "sonner"
import { Button } from "@booleanpress/ui/button"
import { Toaster } from "@booleanpress/ui/sonner"

const toasterId = "sonner-expanded"

export default function SonnerExpanded() {
  function sendAll() {
    toast.success("Sent to hello@example.com", { toasterId })
    toast.success("Sent to billing@example.com", { toasterId })
    toast.error("Rejected by support@example.org", { toasterId })
  }

  return (
    <>
      <Button variant="outline" onClick={sendAll}>
        Send three test emails
      </Button>
      <Toaster id={toasterId} expand />
    </>
  )
}
