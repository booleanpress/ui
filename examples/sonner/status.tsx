import { toast } from "sonner"
import { Button } from "@booleanpress/ui/button"
import { Toaster } from "@booleanpress/ui/sonner"

const toasterId = "sonner-status"

export default function SonnerStatus() {
  return (
    <>
      <div className="flex flex-wrap justify-center gap-2">
        <Button variant="outline" onClick={() => toast.success("Test email delivered", { toasterId })}>
          Success
        </Button>
        <Button variant="outline" onClick={() => toast.error("The mailer rejected the email", { toasterId })}>
          Error
        </Button>
        <Button variant="outline" onClick={() => toast.warning("Your API key expires soon", { toasterId })}>
          Warning
        </Button>
        <Button variant="outline" onClick={() => toast.info("The backup mailer is in use", { toasterId })}>
          Info
        </Button>
      </div>
      <Toaster id={toasterId} />
    </>
  )
}
