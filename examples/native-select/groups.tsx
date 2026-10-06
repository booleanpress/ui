import { Label } from "@booleanpress/ui/label"
import { NativeSelect, NativeSelectOptGroup, NativeSelectOption } from "@booleanpress/ui/native-select"

export default function NativeSelectGroups() {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="mailer">Mailer</Label>
      <NativeSelect id="mailer" defaultValue="">
        <NativeSelectOption value="" disabled>
          Choose a mailer
        </NativeSelectOption>
        <NativeSelectOptGroup label="API">
          <NativeSelectOption value="ses">Amazon SES</NativeSelectOption>
          <NativeSelectOption value="sendgrid">SendGrid</NativeSelectOption>
        </NativeSelectOptGroup>
        <NativeSelectOptGroup label="SMTP">
          <NativeSelectOption value="smtp">Custom SMTP</NativeSelectOption>
        </NativeSelectOptGroup>
      </NativeSelect>
    </div>
  )
}
