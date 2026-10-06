import { Field, FieldDescription, FieldLabel } from "@booleanpress/ui/field"
import { Input } from "@booleanpress/ui/input"

export default function FieldBasic() {
  return (
    <Field className="max-w-sm">
      <FieldLabel htmlFor="reply-to">Reply-to address</FieldLabel>
      <Input id="reply-to" type="email" placeholder="support@example.com" aria-describedby="reply-to-help" />
      <FieldDescription id="reply-to-help">Replies to your emails go here.</FieldDescription>
    </Field>
  )
}
