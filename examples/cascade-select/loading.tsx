import { CascadeSelect, type CascadeSelectOption } from "@booleanpress/ui/cascade-select"
import { Label } from "@booleanpress/ui/label"

const ORGANISATIONS: CascadeSelectOption[] = [
  { value: "acme", label: "Acme Mail", hasChildren: true },
  { value: "northwind", label: "Northwind Traders", hasChildren: true },
]

const PROJECTS: Record<string, CascadeSelectOption[]> = {
  acme: [
    { value: "acme-newsletter", label: "Newsletter" },
    { value: "acme-receipts", label: "Receipts" },
  ],
  northwind: [{ value: "northwind-alerts", label: "Stock alerts" }],
}

// A level that loads after a fixed delay, as a request to the app's API would.
function loadProjects(option: CascadeSelectOption) {
  return new Promise<CascadeSelectOption[]>((resolve) => setTimeout(() => resolve(PROJECTS[option.value] ?? []), 800))
}

export default function CascadeSelectLoading() {
  return (
    <div className="flex w-full max-w-64 flex-col gap-2">
      <Label htmlFor="sending-project">Project</Label>
      <CascadeSelect
        id="sending-project"
        options={ORGANISATIONS}
        loadOptions={loadProjects}
        placeholder="Choose a project"
        className="w-full"
      />
    </div>
  )
}
