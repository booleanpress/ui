import { CircleAlertIcon, CircleCheckIcon, InfoIcon, LoaderCircleIcon, TriangleAlertIcon } from "lucide-react"
import { Alert, AlertDescription } from "@booleanpress/ui/alert"

export default function AlertOutlined() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Alert appearance="outline" variant="success">
        <CircleCheckIcon />
        <AlertDescription>The mailer is connected.</AlertDescription>
      </Alert>
      <Alert appearance="outline" variant="info">
        <InfoIcon />
        <AlertDescription>Logs are kept for 30 days.</AlertDescription>
      </Alert>
      <Alert appearance="outline" variant="warning">
        <TriangleAlertIcon />
        <AlertDescription>Your API key expires on 12 October 2026.</AlertDescription>
      </Alert>
      <Alert appearance="outline" variant="destructive">
        <CircleAlertIcon />
        <AlertDescription>The last test email was rejected.</AlertDescription>
      </Alert>
      <Alert appearance="outline">
        <LoaderCircleIcon />
        <AlertDescription>The import may take a few minutes.</AlertDescription>
      </Alert>
    </div>
  )
}
