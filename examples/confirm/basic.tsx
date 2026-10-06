import { useState } from "react"
import { Button } from "@booleanpress/ui/button"
import { ConfirmProvider, useConfirm } from "@booleanpress/ui/confirm"

function SendTest() {
  const confirm = useConfirm()
  const [result, setResult] = useState("")

  const send = async () => {
    const confirmed = await confirm({
      title: "Send a test email?",
      description: "A test message goes to admin@example.com through the Primary mailer.",
      confirmLabel: "Send",
    })
    setResult(confirmed ? "Test email sent." : "Nothing was sent.")
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <Button onClick={send}>Send test email</Button>
      <p className="min-h-5 text-sm text-muted-foreground" aria-live="polite">
        {result}
      </p>
    </div>
  )
}

export default function ConfirmBasic() {
  return (
    <ConfirmProvider>
      <SendTest />
    </ConfirmProvider>
  )
}
