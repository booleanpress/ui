import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from "@booleanpress/ui/field"
import { Input } from "@booleanpress/ui/input"

export default function FieldGroupExample() {
  return (
    <FieldSet className="w-full max-w-sm">
      <FieldLegend>Connection</FieldLegend>
      <FieldDescription>The mail server that sends your site&apos;s email.</FieldDescription>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="group-host">Host</FieldLabel>
          <Input id="group-host" defaultValue="smtp.example.com" />
        </Field>
        <Field>
          <FieldLabel htmlFor="group-port">Port</FieldLabel>
          <Input id="group-port" defaultValue="587" />
        </Field>
        <FieldSeparator>Sign-in</FieldSeparator>
        <Field>
          <FieldLabel htmlFor="group-user">Username</FieldLabel>
          <Input id="group-user" defaultValue="apikey" />
        </Field>
      </FieldGroup>
    </FieldSet>
  )
}
