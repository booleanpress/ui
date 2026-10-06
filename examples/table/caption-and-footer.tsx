import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@booleanpress/ui/table"

const ROWS = [
  { mailer: "Amazon SES", sent: 1840, failed: 12 },
  { mailer: "Postmark", sent: 960, failed: 3 },
  { mailer: "SMTP relay", sent: 215, failed: 9 },
]

export default function TableCaptionAndFooter() {
  const sent = ROWS.reduce((sum, row) => sum + row.sent, 0)
  const failed = ROWS.reduce((sum, row) => sum + row.failed, 0)

  return (
    <Table className="max-w-md">
      <TableCaption>Emails by mailer, last 7 days.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Mailer</TableHead>
          <TableHead className="text-end">Sent</TableHead>
          <TableHead className="text-end">Failed</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ROWS.map((row) => (
          <TableRow key={row.mailer}>
            <TableCell className="font-medium">{row.mailer}</TableCell>
            <TableCell className="text-end tabular-nums">{row.sent.toLocaleString("en")}</TableCell>
            <TableCell className="text-end tabular-nums">{row.failed}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell className="text-end tabular-nums">{sent.toLocaleString("en")}</TableCell>
          <TableCell className="text-end tabular-nums">{failed}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}
