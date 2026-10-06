import { Avatar, AvatarFallback } from "@booleanpress/ui/avatar"
import { Label } from "@booleanpress/ui/label"
import { Listbox, ListboxItem } from "@booleanpress/ui/listbox"

const AGENTS = [
  { id: "sc", name: "Sara Chowdhury", role: "Support lead" },
  { id: "ar", name: "Arif Rahman", role: "Billing specialist" },
  { id: "jk", name: "Jonas Keller", role: "Deliverability engineer" },
]

export default function ListboxCustomOption() {
  return (
    <div className="flex w-full max-w-64 flex-col gap-2">
      <Label id="listbox-agent-label">Assign the ticket to</Label>
      <Listbox aria-labelledby="listbox-agent-label" defaultValue="ar">
        {AGENTS.map((agent) => (
          <ListboxItem
            key={agent.id}
            value={agent.id}
            textValue={agent.name}
            description={agent.role}
            icon={
              <Avatar>
                <AvatarFallback className="text-xs">{agent.id.toUpperCase()}</AvatarFallback>
              </Avatar>
            }
          >
            <span className="font-medium">{agent.name}</span>
          </ListboxItem>
        ))}
      </Listbox>
    </div>
  )
}
