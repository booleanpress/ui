import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@booleanpress/ui/table"

export default function TableEmpty() {
  return (
    <Table className="max-w-xl">
      <TableHeader>
        <TableRow>
          <TableHead>Recipient</TableHead>
          <TableHead>Subject</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
            No emails match these filters.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
