import { useRef } from "react"
import { toast } from "sonner"
import { Button } from "@booleanpress/ui/button"
import { Toaster } from "@booleanpress/ui/sonner"

const toasterId = "sonner-sticky"

export default function SonnerSticky() {
  const id = useRef<string | number | null>(null)

  function show() {
    id.current = toast.warning("The mailer is paused", {
      toasterId,
      description: "Emails wait in the queue until you resume it.",
      duration: Infinity,
    })
  }

  return (
    <>
      <div className="flex flex-wrap justify-center gap-2">
        <Button variant="outline" onClick={show}>
          Pause the mailer
        </Button>
        <Button variant="ghost" onClick={() => id.current !== null && toast.dismiss(id.current)}>
          Dismiss the toast
        </Button>
      </div>
      <Toaster id={toasterId} />
    </>
  )
}
