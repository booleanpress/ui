import { Toggle } from "@booleanpress/ui/toggle"

export default function ToggleInvalid() {
  return (
    <div className="flex flex-col items-start gap-2">
      <Toggle aria-invalid aria-describedby="confirm-domain-error">
        Domain verified
      </Toggle>
      <p id="confirm-domain-error" className="text-xs text-destructive-strong">
        Verify the sending domain before you turn on the mailer.
      </p>
    </div>
  )
}
