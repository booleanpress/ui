import { CheckboxGroup, CheckboxGroupItem } from "@booleanpress/ui/checkbox-group"

export default function CheckboxGroupDisabled() {
  return (
    <div className="flex flex-col gap-8">
      <CheckboxGroup disabled defaultValue={["smtp"]} aria-label="Fallback mailers, locked">
        <CheckboxGroupItem value="smtp" label="SMTP" />
        <CheckboxGroupItem value="ses" label="Amazon SES" />
      </CheckboxGroup>
      <CheckboxGroup defaultValue={["ses"]} aria-label="Fallback mailers">
        <CheckboxGroupItem value="smtp" label="SMTP" />
        <CheckboxGroupItem value="ses" label="Amazon SES" />
        <CheckboxGroupItem value="postmark" label="Postmark (no API key yet)" disabled />
      </CheckboxGroup>
    </div>
  )
}
