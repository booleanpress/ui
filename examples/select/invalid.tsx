import { Label } from "@booleanpress/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@booleanpress/ui/select"

export default function SelectInvalid() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Label htmlFor="mailer-invalid">Mailer</Label>
      <Select required>
        <SelectTrigger id="mailer-invalid" className="w-full" aria-invalid aria-describedby="mailer-error">
          <SelectValue placeholder="Choose a mailer" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ses">Amazon SES</SelectItem>
          <SelectItem value="postmark">Postmark</SelectItem>
        </SelectContent>
      </Select>
      <p id="mailer-error" className="text-xs text-destructive-strong">
        Choose a mailer to send the test email.
      </p>
    </div>
  )
}
