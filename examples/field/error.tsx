import { Field, FieldDescription, FieldError, FieldLabel } from "@booleanpress/ui/field"
import { Input } from "@booleanpress/ui/input"

export default function FieldErrorExample() {
  return (
    <Field className="max-w-sm" data-invalid="true">
      <FieldLabel htmlFor="smtp-port">Port</FieldLabel>
      <Input id="smtp-port" defaultValue="99999" aria-invalid aria-describedby="smtp-port-help smtp-port-error" />
      <FieldDescription id="smtp-port-help">Usually 587.</FieldDescription>
      <FieldError id="smtp-port-error">Use a port between 1 and 65535.</FieldError>
    </Field>
  )
}
