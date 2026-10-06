import { ScrollArea, ScrollBar } from "@booleanpress/ui/scroll-area"

const COLUMNS = ["Mailer", "Region", "Sent", "Delivered", "Bounced", "Opened"]
const ROWS = [
  ["Amazon SES", "eu-west-1", "48,210", "48,102", "108", "19,764"],
  ["Postmark", "us-east-1", "21,940", "21,921", "19", "9,431"],
  ["SendGrid", "us-west-2", "18,377", "18,290", "87", "7,102"],
  ["Mailgun", "eu-central-1", "12,804", "12,766", "38", "5,520"],
  ["Brevo", "eu-west-3", "9,615", "9,580", "35", "4,011"],
  ["SMTP relay", "on-premises", "6,240", "6,198", "42", "2,377"],
  ["Resend", "us-east-1", "4,982", "4,975", "7", "2,203"],
  ["Sendmail", "on-premises", "1,307", "1,269", "38", "455"],
  ["Backup relay", "ap-south-1", "866", "860", "6", "301"],
  ["Test mailer", "localhost", "120", "120", "0", "64"],
]

export default function ScrollAreaBoth() {
  return (
    <ScrollArea type="always" className="h-80 w-full max-w-sm rounded-md border">
      <table className="w-max text-sm/normal">
        <thead className="bg-subtle text-start text-xs/normal text-muted-foreground uppercase">
          <tr>
            {COLUMNS.map((column) => (
              <th key={column} scope="col" className="border-b px-4 py-3 text-start font-medium">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map(([mailer, ...cells]) => (
            <tr key={mailer} className="border-b last:border-b-0">
              <th scope="row" className="px-4 py-2.5 text-start font-medium">
                {mailer}
              </th>
              {cells.map((cell, i) => (
                <td key={COLUMNS[i + 1]} className="px-4 py-2.5 text-muted-foreground">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
