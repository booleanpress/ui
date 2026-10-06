import { Label } from "@booleanpress/ui/label"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@booleanpress/ui/combobox"

const MAILERS = ["Amazon SES", "Brevo", "Mailgun", "Mailjet", "Postmark", "Resend", "SendGrid", "SparkPost"]

export default function ComboboxBasic() {
  return (
    <div className="flex w-full max-w-56 flex-col gap-2">
      <Label htmlFor="combobox-mailer">Mailer</Label>
      <Combobox items={MAILERS}>
        <ComboboxInput id="combobox-mailer" placeholder="Search mailers" showTrigger={false} />
        <ComboboxContent>
          <ComboboxEmpty />
          <ComboboxList>
            {(mailer: string) => (
              <ComboboxItem key={mailer} value={mailer}>
                {mailer}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}
