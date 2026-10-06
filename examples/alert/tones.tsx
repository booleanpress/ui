import { CircleAlertIcon, CircleCheckIcon, InfoIcon, TriangleAlertIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@booleanpress/ui/alert"

export default function AlertTones() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Alert variant="success">
        <CircleCheckIcon />
        <AlertTitle>Connection verified</AlertTitle>
        <AlertDescription>The test email was accepted by the mailer.</AlertDescription>
      </Alert>
      <Alert variant="info">
        <InfoIcon />
        <AlertTitle>Backup mailer in use</AlertTitle>
        <AlertDescription>New emails go through the backup mailer until you switch back.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <TriangleAlertIcon />
        <AlertTitle>API key expires soon</AlertTitle>
        <AlertDescription>Create a new key before 12 October 2026.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <CircleAlertIcon />
        <AlertTitle>Delivery failed</AlertTitle>
        <AlertDescription>The mailer rejected the sender address.</AlertDescription>
      </Alert>
    </div>
  )
}
