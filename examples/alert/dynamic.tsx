import { useRef, useState } from "react"
import { CircleAlertIcon, CircleCheckIcon, InfoIcon, TriangleAlertIcon } from "lucide-react"
import { Alert, AlertDescription } from "@booleanpress/ui/alert"
import { Button } from "@booleanpress/ui/button"

const MESSAGES = [
  { variant: "success", icon: CircleCheckIcon, text: "Test email delivered to hello@example.com." },
  { variant: "info", icon: InfoIcon, text: "The backup mailer took over for 2 minutes." },
  { variant: "warning", icon: TriangleAlertIcon, text: "3 emails are waiting for a retry." },
  { variant: "destructive", icon: CircleAlertIcon, text: "The mailer rejected the sender address." },
] as const

export default function AlertDynamic() {
  const [shown, setShown] = useState<number[]>([])
  const next = useRef(0)

  function add() {
    const id = next.current
    next.current += 1
    setShown((list) => [...list, id])
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div className="flex justify-center gap-2">
        <Button onClick={add}>Add a message</Button>
        <Button variant="secondary" onClick={() => setShown([])} disabled={shown.length === 0}>
          Clear messages
        </Button>
      </div>
      {shown.map((id) => {
        const { variant, icon: Icon, text } = MESSAGES[id % MESSAGES.length]
        return (
          <Alert key={id} variant={variant}>
            <Icon />
            <AlertDescription>{text}</AlertDescription>
          </Alert>
        )
      })}
    </div>
  )
}
