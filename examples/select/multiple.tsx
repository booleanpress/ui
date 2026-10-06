import { useRef, useState } from "react"
import { Combobox, ComboboxContent, ComboboxItem, ComboboxList, ComboboxTrigger } from "@booleanpress/ui/combobox"

const CHANNELS = ["Email", "SMS", "Push", "Webhook"]

export default function SelectMultiple() {
  const [values, setValues] = useState<string[]>(["Email"])
  const anchor = useRef<HTMLButtonElement>(null)
  return <Combobox items={CHANNELS} multiple value={values} onValueChange={setValues}>
    <ComboboxTrigger ref={anchor} aria-label="Channels" className="h-8.5 w-56 justify-between rounded-md border border-control bg-field px-2.5 text-sm text-foreground">
      {values.length ? values.join(", ") : "Choose channels"}
    </ComboboxTrigger>
    <ComboboxContent anchor={anchor}>
      <ComboboxList>{(channel: string) => <ComboboxItem key={channel} value={channel}>{channel}</ComboboxItem>}</ComboboxList>
    </ComboboxContent>
  </Combobox>
}
