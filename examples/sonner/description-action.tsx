import { toast } from "sonner"
import { Button } from "@booleanpress/ui/button"
import { Toaster } from "@booleanpress/ui/sonner"

const toasterId = "sonner-description-action"

export default function SonnerDescriptionAction() {
  function remove() {
    toast("Routing rule deleted", {
      toasterId,
      description: "Emails to example.com use the default mailer again.",
      action: { label: "Undo", onClick: () => toast.success("Routing rule restored", { toasterId }) },
    })
  }

  return (
    <>
      <Button variant="outline" onClick={remove}>
        Delete the rule
      </Button>
      <Toaster id={toasterId} />
    </>
  )
}
