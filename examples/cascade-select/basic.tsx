import { CascadeSelect, type CascadeSelectOption } from "@booleanpress/ui/cascade-select"
import { Label } from "@booleanpress/ui/label"

const OFFICES: CascadeSelectOption[] = [
  {
    value: "au",
    label: "Australia",
    children: [
      { value: "au-nsw", label: "New South Wales", children: [{ value: "sydney", label: "Sydney" }, { value: "newcastle", label: "Newcastle" }] },
      { value: "au-qld", label: "Queensland", children: [{ value: "brisbane", label: "Brisbane" }, { value: "townsville", label: "Townsville" }] },
    ],
  },
  {
    value: "us",
    label: "United States",
    children: [
      { value: "us-ca", label: "California", children: [{ value: "los-angeles", label: "Los Angeles" }, { value: "san-francisco", label: "San Francisco" }] },
      { value: "us-ny", label: "New York", children: [{ value: "new-york-city", label: "New York City" }, { value: "buffalo", label: "Buffalo" }] },
    ],
  },
  {
    value: "ca",
    label: "Canada",
    children: [
      { value: "ca-on", label: "Ontario", children: [{ value: "toronto", label: "Toronto" }, { value: "ottawa", label: "Ottawa" }] },
      { value: "ca-qc", label: "Quebec", children: [{ value: "montreal", label: "Montreal" }, { value: "quebec-city", label: "Quebec City" }] },
    ],
  },
]

export default function CascadeSelectBasic() {
  return (
    <div className="flex w-full max-w-64 flex-col gap-2">
      <Label htmlFor="office-city">Office</Label>
      <CascadeSelect id="office-city" options={OFFICES} placeholder="Select a city" className="w-full" />
    </div>
  )
}
