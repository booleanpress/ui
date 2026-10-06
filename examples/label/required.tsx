import { Field, FieldDescription } from "@booleanpress/ui/field"
import { Input } from "@booleanpress/ui/input"
import { Label } from "@booleanpress/ui/label"

export default function RequiredLabel() {
  return (
    <Field className="max-w-sm">
      <Label htmlFor="required-email">Email <span aria-hidden="true">*</span></Label>
      <Input id="required-email" type="email" required aria-describedby="required-email-hint" />
      <FieldDescription id="required-email-hint">Required for account notifications.</FieldDescription>
    </Field>
  )
}
