import { toast } from "sonner"
import { Button } from "@booleanpress/ui/button"
import { Toaster } from "@booleanpress/ui/sonner"

const toasterId = "sonner-promise"

export default function SonnerPromise() {
  function sendTest() {
    const request = new Promise<string>((resolve) => window.setTimeout(() => resolve("hello@example.com"), 2000))
    toast.promise(request, {
      toasterId,
      loading: "Sending the test email…",
      success: (to) => `Test email sent to ${to}`,
      error: "The test email failed",
    })
  }

  return (
    <>
      <Button variant="outline" onClick={sendTest}>
        Send a test email
      </Button>
      <Toaster id={toasterId} />
    </>
  )
}
