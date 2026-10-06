import { ArchiveIcon, Trash2Icon } from "lucide-react"
import { useState } from "react"
import { ActionBar, ActionBarButton } from "@booleanpress/ui/action-bar"
import { Checkbox } from "@booleanpress/ui/checkbox"

const TICKETS = [
  { id: "t-1041", subject: "Cannot connect to SES" },
  { id: "t-1040", subject: "Invoice is missing a VAT number" },
  { id: "t-1039", subject: "Import stops at row 200" },
  { id: "t-1038", subject: "Test email lands in spam" },
]

export default function ActionBarBasic() {
  const [selected, setSelected] = useState<string[]>(["t-1040"])
  const toggle = (id: string, on: boolean) => setSelected((cur) => (on ? [...cur, id] : cur.filter((x) => x !== id)))

  return (
    <div className="relative h-72 w-full max-w-md rounded-md border">
      <ul className="divide-y">
        {TICKETS.map((ticket) => (
          <li key={ticket.id} className="flex items-center gap-3 px-4 py-2.5 text-sm">
            <Checkbox
              id={ticket.id}
              checked={selected.includes(ticket.id)}
              onCheckedChange={(checked) => toggle(ticket.id, checked === true)}
            />
            <label htmlFor={ticket.id} className="flex-1">
              {ticket.subject}
            </label>
          </li>
        ))}
      </ul>
      <ActionBar count={selected.length} onClear={() => setSelected([])}>
        <ActionBarButton>
          <ArchiveIcon />
          Archive
        </ActionBarButton>
        <ActionBarButton severity="danger" onClick={() => setSelected([])}>
          <Trash2Icon />
          Delete
        </ActionBarButton>
      </ActionBar>
    </div>
  )
}
