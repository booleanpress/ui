import { RotateCwIcon, Trash2Icon } from "lucide-react"
import { useState } from "react"
import { ActionBar, ActionBarButton } from "@booleanpress/ui/action-bar"
import { Checkbox } from "@booleanpress/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@booleanpress/ui/table"

const ROWS = [
  { id: "4120", to: "ana@example.com", status: "Bounced" },
  { id: "4119", to: "li@example.com", status: "Failed" },
  { id: "4118", to: "sam@example.com", status: "Bounced" },
  { id: "4117", to: "grace@example.com", status: "Failed" },
]

export default function ActionBarInTable() {
  const [selected, setSelected] = useState<string[]>([])
  const all = selected.length === ROWS.length ? true : selected.length > 0 ? "indeterminate" : false
  const toggle = (id: string, on: boolean) => setSelected((cur) => (on ? [...cur, id] : cur.filter((x) => x !== id)))

  return (
    <div className="relative h-80 w-full max-w-xl">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8">
              <Checkbox
                aria-label="Select all emails"
                checked={all}
                onCheckedChange={(on) => setSelected(on === true ? ROWS.map((r) => r.id) : [])}
              />
            </TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Recipient</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ROWS.map((row) => (
            <TableRow key={row.id} data-state={selected.includes(row.id) ? "selected" : undefined}>
              <TableCell>
                <Checkbox
                  aria-label={`Select email ${row.id}`}
                  checked={selected.includes(row.id)}
                  onCheckedChange={(on) => toggle(row.id, on === true)}
                />
              </TableCell>
              <TableCell className="tabular-nums">#{row.id}</TableCell>
              <TableCell>{row.to}</TableCell>
              <TableCell>{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ActionBar count={selected.length} onClear={() => setSelected([])}>
        <ActionBarButton>
          <RotateCwIcon />
          Resend
        </ActionBarButton>
        <ActionBarButton severity="danger" onClick={() => setSelected([])}>
          <Trash2Icon />
          Delete
        </ActionBarButton>
      </ActionBar>
    </div>
  )
}
