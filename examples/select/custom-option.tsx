import { useState } from "react"
import { Avatar, AvatarBadge, AvatarFallback } from "@booleanpress/ui/avatar"
import { Label } from "@booleanpress/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@booleanpress/ui/select"

const AGENTS = [
  { id: "sc", name: "Sara Chowdhury", role: "Support lead", status: "bg-success" },
  { id: "ar", name: "Arif Rahman", role: "Billing specialist", status: "bg-warning" },
  { id: "jk", name: "Jonas Keller", role: "Deliverability engineer", status: "bg-success" },
  { id: "tm", name: "Tamsin Moore", role: "Integrations engineer", status: "bg-muted-foreground" },
]

export default function SelectCustomOption() {
  const [agentId, setAgentId] = useState("")
  const agent = AGENTS.find((item) => item.id === agentId)

  return (
    <div className="flex w-full max-w-60 flex-col gap-2">
      <Label htmlFor="ticket-assignee">Assign the ticket to</Label>
      <Select value={agentId} onValueChange={setAgentId}>
        <SelectTrigger id="ticket-assignee" className="w-full">
          <SelectValue placeholder="Choose an agent">
            {agent ? (
              <>
                <span aria-hidden="true" className={`size-2 shrink-0 rounded-full ${agent.status}`} />
                {agent.name}
              </>
            ) : undefined}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {AGENTS.map((item) => (
            <SelectItem
              key={item.id}
              value={item.id}
              description={item.role}
              icon={
                <Avatar>
                  <AvatarFallback className="text-xs">{item.id.toUpperCase()}</AvatarFallback>
                  <AvatarBadge className={item.status} />
                </Avatar>
              }
            >
              <span className="font-medium">{item.name}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
