import { Checkbox } from "@booleanpress/ui/checkbox"
import { Field, FieldContent, FieldDescription, FieldLabel } from "@booleanpress/ui/field"

export default function FieldHorizontal() {
  return (
    <Field orientation="horizontal" className="max-w-sm">
      <Checkbox id="bounce-alerts" defaultChecked aria-describedby="bounce-alerts-help" />
      <FieldContent>
        <FieldLabel htmlFor="bounce-alerts">Alert me about bounces</FieldLabel>
        <FieldDescription id="bounce-alerts-help">Sent once an hour, at most.</FieldDescription>
      </FieldContent>
    </Field>
  )
}
