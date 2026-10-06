import { Label } from "@booleanpress/ui/label"
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from "@booleanpress/ui/autocomplete"

const SUBJECTS = ["Your receipt", "Your password reset link", "Welcome aboard", "Your invoice is ready"]

export default function AutocompleteFilled() {
  return (
    <div className="flex w-full max-w-64 flex-col gap-2">
      <Label htmlFor="autocomplete-subject">Subject</Label>
      <Autocomplete items={SUBJECTS}>
        <AutocompleteInput id="autocomplete-subject" variant="filled" placeholder="Write a subject" />
        <AutocompleteContent>
          <AutocompleteList>
            {(subject: string) => (
              <AutocompleteItem key={subject} value={subject}>
                {subject}
              </AutocompleteItem>
            )}
          </AutocompleteList>
        </AutocompleteContent>
      </Autocomplete>
    </div>
  )
}
