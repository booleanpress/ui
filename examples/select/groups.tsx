import { Label } from "@booleanpress/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@booleanpress/ui/select"

const API_MAILERS = ["Amazon SES", "Brevo", "Mailgun", "Postmark", "SendGrid", "SparkPost", "Resend", "Mailjet"]
const SMTP_MAILERS = ["Gmail SMTP", "Outlook SMTP", "Zoho SMTP", "Custom SMTP"]

export default function SelectGroups() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Label htmlFor="mailer-groups">Mailer</Label>
      <Select>
        <SelectTrigger id="mailer-groups" className="w-full">
          <SelectValue placeholder="Choose a mailer" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>API mailers</SelectLabel>
            {API_MAILERS.map((name) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>SMTP</SelectLabel>
            {SMTP_MAILERS.map((name) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
