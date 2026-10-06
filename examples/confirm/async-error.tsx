import { useRef, useState } from "react"
import { Button } from "@booleanpress/ui/button"
import { ConfirmProvider, useConfirm } from "@booleanpress/ui/confirm"

function PurgeQueue() {
  const confirm = useConfirm()
  const attempts = useRef(0)
  const [purged, setPurged] = useState(false)

  // The first attempt fails, as a timed-out request would; the second succeeds.
  const purgeQueue = () =>
    new Promise<void>((resolve, reject) => {
      attempts.current += 1
      const fails = attempts.current === 1
      setTimeout(() => (fails ? reject(new Error("The queue did not answer in time. Try again.")) : resolve()), 1200)
    })

  const purge = async () => {
    const confirmed = await confirm({
      title: "Purge the email queue?",
      description: "The 38 emails waiting to be sent are removed.",
      tone: "destructive",
      confirmLabel: "Purge",
      onConfirm: purgeQueue,
    })
    if (confirmed) setPurged(true)
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <Button variant="outline" onClick={purge} disabled={purged}>
        Purge queue
      </Button>
      <p className="min-h-5 text-sm text-muted-foreground" aria-live="polite">
        {purged ? "The queue is empty." : ""}
      </p>
    </div>
  )
}

export default function ConfirmAsyncError() {
  return (
    <ConfirmProvider>
      <PurgeQueue />
    </ConfirmProvider>
  )
}
