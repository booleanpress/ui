import { InfoIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@booleanpress/ui/alert"

export default function AlertBasic() {
  return (
    <Alert className="w-full max-w-md">
      <InfoIcon />
      <AlertTitle>Logging is on</AlertTitle>
      <AlertDescription>Every email is kept for 30 days, then deleted.</AlertDescription>
    </Alert>
  )
}
