import { CheckboxGroup, CheckboxGroupItem } from "@booleanpress/ui/checkbox-group"

const SCOPES = [
  { value: "mail.send", label: "Send email", description: "Send through every connected mailer." },
  { value: "logs.read", label: "Read delivery logs", description: "See each message's status and events." },
  { value: "contacts.write", label: "Edit contacts", description: "Add, change and remove subscribers." },
  { value: "keys.manage", label: "Manage API keys", description: "Create and revoke other keys." },
]

export default function CheckboxGroupDynamic() {
  return (
    <CheckboxGroup defaultValue={["mail.send", "logs.read"]} aria-label="API key scopes" className="max-w-sm">
      {SCOPES.map((scope) => (
        <CheckboxGroupItem key={scope.value} value={scope.value} label={scope.label} description={scope.description} />
      ))}
    </CheckboxGroup>
  )
}
