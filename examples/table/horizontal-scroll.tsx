import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@booleanpress/ui/table"

export default function TableHorizontalScroll() {
  return (
    <div className="w-full max-w-xs rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Message ID</TableHead>
            <TableHead>Recipient</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Mailer</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-mono text-xs">0100019a2b3c4d5e-7f8a9b0c-1d2e</TableCell>
            <TableCell>ana@example.com</TableCell>
            <TableCell>Your monthly delivery summary</TableCell>
            <TableCell>Amazon SES</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
