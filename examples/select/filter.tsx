import { useRef, useState } from "react"
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList, ComboboxTrigger } from "@booleanpress/ui/combobox"

const MAILERS = ["Amazon SES", "Brevo", "Mailgun", "Postmark", "Resend", "SendGrid"]

export default function SelectFilter() {
  const [value, setValue] = useState<string | null>(null)
  const anchor = useRef<HTMLButtonElement>(null)
  return <Combobox items={MAILERS} value={value} onValueChange={setValue}>
    <ComboboxTrigger ref={anchor} aria-label="Mailer" className="h-8.5 w-56 justify-between rounded-md border border-control bg-field px-2.5 text-sm text-foreground">
      {value ?? "Choose a mailer"}
    </ComboboxTrigger>
    <ComboboxContent anchor={anchor}>
      <div className="p-2"><ComboboxInput aria-label="Filter mailers" placeholder="Search mailers" showTrigger={false} /></div>
      <ComboboxEmpty />
      <ComboboxList>{(mailer: string) => <ComboboxItem key={mailer} value={mailer}>{mailer}</ComboboxItem>}</ComboboxList>
    </ComboboxContent>
  </Combobox>
}
