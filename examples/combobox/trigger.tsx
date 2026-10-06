import { Label } from "@booleanpress/ui/label"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@booleanpress/ui/combobox"

const REGIONS = [
  { value: "us-east-1", label: "US East (N. Virginia)" },
  { value: "us-west-2", label: "US West (Oregon)" },
  { value: "eu-west-1", label: "Europe (Ireland)" },
  { value: "eu-central-1", label: "Europe (Frankfurt)" },
  { value: "ap-south-1", label: "Asia Pacific (Mumbai)" },
  { value: "ap-southeast-2", label: "Asia Pacific (Sydney)" },
]

export default function ComboboxTrigger() {
  return (
    <div className="flex w-full max-w-56 flex-col gap-2">
      <Label htmlFor="combobox-region">Sending region</Label>
      <Combobox items={REGIONS} defaultValue={REGIONS[2]}>
        <ComboboxInput id="combobox-region" placeholder="Choose a region" />
        <ComboboxContent>
          <ComboboxEmpty />
          <ComboboxList>
            {(region: (typeof REGIONS)[number]) => (
              <ComboboxItem key={region.value} value={region}>
                {region.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}
