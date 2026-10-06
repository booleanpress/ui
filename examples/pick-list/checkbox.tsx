import { PickList } from "@booleanpress/ui/pick-list"

const SCOPES = [
  { id: "mail.send", label: "Send email" },
  { id: "mail.read", label: "Read delivery logs" },
  { id: "contacts.read", label: "Read contacts" },
  { id: "contacts.write", label: "Edit contacts" },
  { id: "templates.read", label: "Read templates" },
  { id: "templates.write", label: "Edit templates" },
  { id: "webhooks.manage", label: "Manage webhooks" },
]

export default function PickListCheckbox() {
  return (
    <PickList
      sourceHeader="Available scopes"
      targetHeader="Granted to this API key"
      defaultSource={SCOPES.slice(1)}
      defaultTarget={SCOPES.slice(0, 1)}
      indicator="checkbox"
      selectAll
      className="w-full max-w-2xl"
    />
  )
}
