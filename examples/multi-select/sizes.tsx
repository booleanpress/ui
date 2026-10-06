import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectList,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@booleanpress/ui/multi-select"

const SIZES = [
  { size: "sm", label: "Small" },
  { size: "default", label: "Default" },
  { size: "lg", label: "Large" },
] as const

const REGIONS = ["Europe (Ireland)", "Europe (Frankfurt)", "US East (N. Virginia)", "Asia Pacific (Mumbai)"]

export default function MultiSelectSizes() {
  return (
    <div className="flex w-full max-w-56 flex-col gap-4">
      {SIZES.map(({ size, label }) => (
        <MultiSelect key={size} items={REGIONS}>
          <MultiSelectTrigger size={size} aria-label={`Regions, ${label.toLowerCase()} size`} className="w-full">
            <MultiSelectValue placeholder={label} />
          </MultiSelectTrigger>
          <MultiSelectContent>
            <MultiSelectList>
              {(region: string) => (
                <MultiSelectItem key={region} value={region}>
                  {region}
                </MultiSelectItem>
              )}
            </MultiSelectList>
          </MultiSelectContent>
        </MultiSelect>
      ))}
    </div>
  )
}
