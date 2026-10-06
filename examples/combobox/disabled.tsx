import { Label } from "@booleanpress/ui/label"
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@booleanpress/ui/combobox"

const MAILERS = ["Amazon SES", "Mailgun", "Postmark"]

export default function ComboboxDisabled() {
  return (
    <div className="flex w-full max-w-56 flex-col gap-2">
      <Label htmlFor="combobox-fallback">Fallback mailer</Label>
      <Combobox items={MAILERS} defaultValue="Postmark" disabled>
        <ComboboxInput id="combobox-fallback" disabled />
        <ComboboxContent>
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
