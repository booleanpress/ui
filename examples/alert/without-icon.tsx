import { Alert, AlertDescription, AlertTitle } from "@booleanpress/ui/alert"

export default function AlertWithoutIcon() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Alert>
        <AlertTitle>Routing rules run in order</AlertTitle>
        <AlertDescription>The first rule that matches an email decides its mailer.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <AlertDescription>This mailer has no sender address yet.</AlertDescription>
      </Alert>
    </div>
  )
}
