import { CheckboxGroup, CheckboxGroupItem } from "@booleanpress/ui/checkbox-group"

export default function CheckboxGroupInvalid() {
  return (
    <div className="flex flex-col gap-3">
      <span id="consent-label" className="text-sm/normal font-medium text-foreground">
        Before you import
      </span>
      <CheckboxGroup aria-labelledby="consent-label" aria-describedby="consent-error" aria-invalid>
        <CheckboxGroupItem value="opt-in" label="Every contact opted in" />
        <CheckboxGroupItem value="terms" label="I accept the import terms" />
      </CheckboxGroup>
      <p id="consent-error" className="text-sm/normal text-destructive-strong">
        Confirm both to import the list.
      </p>
    </div>
  )
}
