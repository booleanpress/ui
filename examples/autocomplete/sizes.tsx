import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from "@booleanpress/ui/autocomplete"

const SIZES = [
  { size: "sm", label: "Small" },
  { size: "default", label: "Default" },
  { size: "lg", label: "Large" },
] as const

const SENDERS = ["Billing team", "Deliverability team", "Support team", "No reply"]

export default function AutocompleteSizes() {
  return (
    <div className="flex w-full max-w-56 flex-col gap-4">
      {SIZES.map(({ size, label }) => (
        <Autocomplete key={size} items={SENDERS}>
          <AutocompleteInput size={size} placeholder={label} aria-label={`Sender name, ${label.toLowerCase()} size`} />
          <AutocompleteContent>
            <AutocompleteList>
              {(sender: string) => (
                <AutocompleteItem key={sender} value={sender}>
                  {sender}
                </AutocompleteItem>
              )}
            </AutocompleteList>
          </AutocompleteContent>
        </Autocomplete>
      ))}
    </div>
  )
}
