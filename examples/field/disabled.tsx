import { Field, FieldDescription, FieldLabel } from "@booleanpress/ui/field"
import { Input } from "@booleanpress/ui/input"

export default function FieldDisabled() {
  return (
    <Field className="max-w-sm" data-disabled="true">
      <FieldLabel htmlFor="locked-domain">Sending domain</FieldLabel>
      <Input id="locked-domain" defaultValue="mail.example.com" disabled aria-describedby="locked-domain-help" />
      <FieldDescription id="locked-domain-help">Verified domains cannot be changed.</FieldDescription>
    </Field>
  )
}
