import { TriangleAlertIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@booleanpress/ui/alert"
import { Button } from "@booleanpress/ui/button"

export default function AlertWithAction() {
  return (
    <Alert variant="warning" className="w-full max-w-md">
      <TriangleAlertIcon />
      <AlertTitle>Another SMTP plugin is active</AlertTitle>
      <AlertDescription>
        <p>Both plugins try to send the same emails.</p>
        <Button size="sm" variant="outline" className="mt-2">
          Review plugins
        </Button>
      </AlertDescription>
    </Alert>
  )
}
