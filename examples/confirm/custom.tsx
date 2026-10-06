import { KeyRoundIcon } from "lucide-react"
import { useState } from "react"
import { Button } from "@booleanpress/ui/button"
import { ConfirmProvider, useConfirm } from "@booleanpress/ui/confirm"

function RotateKey() {
  const confirm = useConfirm()
  const [rotated, setRotated] = useState(false)

  const rotate = async () => {
    const confirmed = await confirm({
      title: "Rotate the API key?",
      description: "Sites that use the current key stop sending until you paste the new one.",
      icon: <KeyRoundIcon />,
      confirmLabel: "Rotate key",
      cancelLabel: "Keep current key",
      defaultFocus: "cancel",
    })
    if (confirmed) setRotated(true)
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <Button variant="outline" onClick={rotate}>
        Rotate API key
      </Button>
      <p className="min-h-5 text-sm text-muted-foreground" aria-live="polite">
        {rotated ? "A new key was created." : ""}
      </p>
    </div>
  )
}

export default function ConfirmCustom() {
  return (
    <ConfirmProvider>
      <RotateKey />
    </ConfirmProvider>
  )
}
