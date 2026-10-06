import { CascadeSelect, type CascadeSelectOption } from "@booleanpress/ui/cascade-select"
import { Label } from "@booleanpress/ui/label"

const REGIONS: CascadeSelectOption[] = [
  {
    value: "eu",
    label: "Europe",
    children: [
      { value: "eu-de", label: "Germany", children: [{ value: "frankfurt", label: "Frankfurt" }, { value: "berlin", label: "Berlin" }] },
      { value: "eu-ie", label: "Ireland", children: [{ value: "dublin", label: "Dublin" }] },
    ],
  },
  {
    value: "na",
    label: "North America",
    children: [
      { value: "na-us", label: "United States", children: [{ value: "virginia", label: "Virginia" }, { value: "oregon", label: "Oregon" }] },
      { value: "na-ca", label: "Canada", children: [{ value: "montreal", label: "Montreal" }] },
    ],
  },
]

export default function CascadeSelectShowPath() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Label htmlFor="data-region">Data region</Label>
      <CascadeSelect id="data-region" options={REGIONS} defaultValue="frankfurt" showPath className="w-full" />
    </div>
  )
}
