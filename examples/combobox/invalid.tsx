import { Label } from "@booleanpress/ui/label"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@booleanpress/ui/combobox"

const MAILERS = ["Amazon SES", "Brevo", "Mailgun", "Postmark", "SendGrid"]

export default function ComboboxInvalid() {
  return (
    <div className="flex w-full max-w-56 flex-col gap-2">
      <Label htmlFor="combobox-invalid">Mailer</Label>
      <Combobox items={MAILERS} required>
        <ComboboxInput id="combobox-invalid" placeholder="Choose a mailer" aria-invalid aria-describedby="combobox-invalid-error" />
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
      <p id="combobox-invalid-error" className="text-xs text-destructive-strong">
        Choose a mailer to send the test email.
      </p>
    </div>
  )
}
