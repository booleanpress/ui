import { Label } from "@booleanpress/ui/label"
import { Listbox, ListboxGroup, ListboxItem, ListboxLabel } from "@booleanpress/ui/listbox"

const GROUPS = [
  { label: "API mailers", items: ["Amazon SES", "Mailgun", "Postmark"] },
  { label: "SMTP", items: ["Gmail SMTP", "Outlook SMTP", "Custom SMTP"] },
]

export default function ListboxGroups() {
  return (
    <div className="flex w-full max-w-56 flex-col gap-2">
      <Label id="listbox-groups-label">Mailer</Label>
      <Listbox aria-labelledby="listbox-groups-label" defaultValue="Postmark" listClassName="max-h-64">
        {GROUPS.map((group) => (
          <ListboxGroup key={group.label}>
            <ListboxLabel>{group.label}</ListboxLabel>
            {group.items.map((mailer) => (
              <ListboxItem key={mailer} value={mailer}>
                {mailer}
              </ListboxItem>
            ))}
          </ListboxGroup>
        ))}
      </Listbox>
    </div>
  )
}
