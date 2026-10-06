import { useState } from "react"
import { Button } from "@booleanpress/ui/button"
import { ConfirmProvider, useConfirm } from "@booleanpress/ui/confirm"

// Stands in for the request that revokes the key.
const revokeKey = () => new Promise<void>((resolve) => setTimeout(resolve, 1500))

function RevokeKey() {
  const confirm = useConfirm()
  const [revoked, setRevoked] = useState(false)

  const revoke = async () => {
    const confirmed = await confirm({
      title: "Revoke the Production key?",
      description: "Requests signed with it are refused from now on.",
      tone: "destructive",
      confirmLabel: "Revoke",
      onConfirm: revokeKey,
    })
    if (confirmed) setRevoked(true)
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <Button variant="outline" onClick={revoke} disabled={revoked}>
        Revoke key
      </Button>
      <p className="min-h-5 text-sm text-muted-foreground" aria-live="polite">
        {revoked ? "The Production key was revoked." : ""}
      </p>
    </div>
  )
}

export default function ConfirmAsync() {
  return (
    <ConfirmProvider>
      <RevokeKey />
    </ConfirmProvider>
  )
}
