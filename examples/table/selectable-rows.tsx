import { useState } from "react"
import { Checkbox } from "@booleanpress/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@booleanpress/ui/table"

const ROWS = [
  { id: "t-1041", subject: "Cannot connect to SES", requester: "Ana Ruiz" },
  { id: "t-1040", subject: "Invoice is missing a VAT number", requester: "Li Wei" },
  { id: "t-1039", subject: "Import stops at row 200", requester: "Sam Okoye" },
]

export default function TableSelectableRows() {
  const [selected, setSelected] = useState<string[]>(["t-1040"])
  const all = selected.length === ROWS.length ? true : selected.length > 0 ? "indeterminate" : false
  const toggle = (id: string, on: boolean) => setSelected((cur) => (on ? [...cur, id] : cur.filter((x) => x !== id)))

  return (
    <Table className="max-w-xl">
      <TableHeader>
        <TableRow>
          <TableHead className="w-8">
            <Checkbox
              aria-label="Select all tickets"
              checked={all}
              onCheckedChange={(checked) => setSelected(checked === true ? ROWS.map((r) => r.id) : [])}
            />
          </TableHead>
          <TableHead>Ticket</TableHead>
          <TableHead>Subject</TableHead>
          <TableHead>Requester</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ROWS.map((row) => (
          <TableRow key={row.id} data-state={selected.includes(row.id) ? "selected" : undefined}>
            <TableCell>
              <Checkbox
                aria-label={`Select ${row.id}`}
                checked={selected.includes(row.id)}
                onCheckedChange={(checked) => toggle(row.id, checked === true)}
              />
            </TableCell>
            <TableCell className="font-medium tabular-nums">{row.id}</TableCell>
            <TableCell>{row.subject}</TableCell>
            <TableCell>{row.requester}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
