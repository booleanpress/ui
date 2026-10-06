import { useState } from "react"
import { CircleCheckIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@booleanpress/ui/alert"
import { Button } from "@booleanpress/ui/button"

export default function AlertAutoDismiss() {
  const [shown, setShown] = useState(0)
  const [open, setOpen] = useState(false)

  function save() {
    setShown((count) => count + 1)
    setOpen(true)
  }

  return (
    <div className="flex w-full max-w-md flex-col items-start gap-3">
      <Button onClick={save}>Save settings</Button>
      {open ? (
        <Alert key={shown} variant="success" duration={4000} onDismiss={() => setOpen(false)}>
          <CircleCheckIcon />
          <AlertTitle>Settings saved</AlertTitle>
          <AlertDescription>This message closes after 4 seconds, unless the pointer rests on it.</AlertDescription>
        </Alert>
      ) : null}
    </div>
  )
}
