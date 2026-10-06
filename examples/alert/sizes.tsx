import { InfoIcon } from "lucide-react"
import { Alert, AlertDescription } from "@booleanpress/ui/alert"

export default function AlertSizes() {
  return (
    <div className="flex flex-col items-center gap-3">
      <Alert size="sm" variant="info" className="w-fit">
        <InfoIcon />
        <AlertDescription>Logs are kept for 30 days.</AlertDescription>
      </Alert>
      <Alert variant="info" className="w-fit">
        <InfoIcon />
        <AlertDescription>Logs are kept for 30 days.</AlertDescription>
      </Alert>
      <Alert size="lg" variant="info" className="w-fit">
        <InfoIcon />
        <AlertDescription>Logs are kept for 30 days.</AlertDescription>
      </Alert>
    </div>
  )
}
