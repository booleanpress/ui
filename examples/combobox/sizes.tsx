import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@booleanpress/ui/combobox"

const SIZES = [
  { size: "sm", label: "Small" },
  { size: "default", label: "Default" },
  { size: "lg", label: "Large" },
] as const

const REGIONS = ["Europe (Ireland)", "Europe (Frankfurt)", "US East (N. Virginia)", "Asia Pacific (Mumbai)"]

export default function ComboboxSizes() {
  return (
    <div className="flex w-full max-w-56 flex-col gap-4">
      {SIZES.map(({ size, label }) => (
        <Combobox key={size} items={REGIONS}>
          <ComboboxInput size={size} placeholder={label} aria-label={`Region, ${label.toLowerCase()} size`} />
          <ComboboxContent>
            <ComboboxEmpty />
            <ComboboxList>
              {(region: string) => (
                <ComboboxItem key={region} value={region}>
                  {region}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      ))}
    </div>
  )
}
