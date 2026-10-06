import { Label } from "@booleanpress/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@booleanpress/ui/select"

export default function SelectFilled() {
  return (
    <div className="flex w-full max-w-56 flex-col gap-2">
      <Label htmlFor="mailer-filled">Fallback mailer</Label>
      <Select>
        <SelectTrigger id="mailer-filled" variant="filled" className="w-full">
          <SelectValue placeholder="Choose a mailer" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ses">Amazon SES</SelectItem>
          <SelectItem value="sendgrid">SendGrid</SelectItem>
          <SelectItem value="postmark">Postmark</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
