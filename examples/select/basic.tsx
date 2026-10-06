import { Label } from "@booleanpress/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@booleanpress/ui/select"

export default function SelectBasic() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Label htmlFor="mailer">Mailer</Label>
      <Select defaultValue="ses">
        <SelectTrigger id="mailer" className="w-full">
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
