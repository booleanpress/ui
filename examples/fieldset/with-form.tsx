import { Field, FieldGroup, FieldLabel } from "@booleanpress/ui/field"
import { Fieldset, FieldsetContent, FieldsetLegend } from "@booleanpress/ui/fieldset"
import { Input } from "@booleanpress/ui/input"
import { Switch } from "@booleanpress/ui/switch"

export default function FieldsetWithForm() {
  return (
    <Fieldset toggleable className="w-full max-w-sm">
      <FieldsetLegend>Sender</FieldsetLegend>
      <FieldsetContent>
        <FieldGroup className="gap-4 pt-1">
          <Field>
            <FieldLabel htmlFor="sender-name">From name</FieldLabel>
            <Input id="sender-name" defaultValue="Acme Support" />
          </Field>
          <Field>
            <FieldLabel htmlFor="sender-email">From email</FieldLabel>
            <Input id="sender-email" type="email" defaultValue="support@example.com" />
          </Field>
          <Field orientation="horizontal">
            <Switch id="sender-force" defaultChecked />
            <FieldLabel htmlFor="sender-force">Use this sender for every email</FieldLabel>
          </Field>
        </FieldGroup>
      </FieldsetContent>
    </Fieldset>
  )
}
