import { useState } from "react"
import { Button } from "@booleanpress/ui/button"
import { ConfirmProvider, useConfirm } from "@booleanpress/ui/confirm"

function DeleteMailer() {
  const confirm = useConfirm()
  const [deleted, setDeleted] = useState(false)

  const remove = async () => {
    const confirmed = await confirm({
      title: "Delete the Staging mailer?",
      description: "Emails queued for it stay in the log, but they are not sent. This cannot be undone.",
      tone: "destructive",
    })
    if (confirmed) setDeleted(true)
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <Button variant="destructive" onClick={remove} disabled={deleted}>
        Delete mailer
      </Button>
      <p className="min-h-5 text-sm text-muted-foreground" aria-live="polite">
        {deleted ? "The Staging mailer was deleted." : ""}
      </p>
    </div>
  )
}

export default function ConfirmDestructive() {
  return (
    <ConfirmProvider>
      <DeleteMailer />
    </ConfirmProvider>
  )
}
