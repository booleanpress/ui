import { Label } from "@booleanpress/ui/label"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
} from "@booleanpress/ui/combobox"

const GROUPS = [
  { value: "API mailers", items: ["Amazon SES", "Brevo", "Mailgun", "Postmark", "SendGrid"] },
  { value: "SMTP", items: ["Gmail SMTP", "Outlook SMTP", "Zoho SMTP", "Custom SMTP"] },
]

export default function ComboboxGroups() {
  return (
    <div className="flex w-full max-w-56 flex-col gap-2">
      <Label htmlFor="combobox-groups">Mailer</Label>
      <Combobox items={GROUPS}>
        <ComboboxInput id="combobox-groups" placeholder="Search mailers" />
        <ComboboxContent>
          <ComboboxEmpty />
          <ComboboxList>
            {(group: (typeof GROUPS)[number]) => (
              <ComboboxGroup key={group.value} items={group.items}>
                <ComboboxLabel>{group.value}</ComboboxLabel>
                {group.items.map((mailer) => (
                  <ComboboxItem key={mailer} value={mailer}>
                    {mailer}
                  </ComboboxItem>
                ))}
              </ComboboxGroup>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}
