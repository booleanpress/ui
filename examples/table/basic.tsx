import { Badge } from "@booleanpress/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@booleanpress/ui/table"

const ROWS = [
  { to: "ana@example.com", subject: "Your invoice", status: "Delivered", sent: "10:42" },
  { to: "li@example.com", subject: "Password reset", status: "Delivered", sent: "10:40" },
  { to: "sam@example.com", subject: "Welcome aboard", status: "Bounced", sent: "10:31" },
]

export default function TableBasic() {
  return (
    <Table className="max-w-xl">
      <TableHeader>
        <TableRow>
          <TableHead>Recipient</TableHead>
          <TableHead>Subject</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-end">Sent</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ROWS.map((row) => (
          <TableRow key={row.to}>
            <TableCell className="font-medium">{row.to}</TableCell>
            <TableCell>{row.subject}</TableCell>
            <TableCell>
              <Badge variant={row.status === "Bounced" ? "destructive" : "secondary"}>{row.status}</Badge>
            </TableCell>
            <TableCell className="text-end tabular-nums">{row.sent}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
