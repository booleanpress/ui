import { Label } from "@booleanpress/ui/label"
import { RadioGroup, RadioGroupItem } from "@booleanpress/ui/radio-group"

const DEPARTMENTS = [
  { value: "billing", label: "Billing" },
  { value: "sales", label: "Sales" },
  { value: "support", label: "Support" },
  { value: "deliverability", label: "Deliverability" },
]

export default function RadioGroupDynamic() {
  return (
    <RadioGroup aria-label="Route new tickets to" orientation="horizontal" className="flex flex-wrap gap-4">
      {DEPARTMENTS.map((department) => (
        <div key={department.value} className="flex items-center gap-2">
          <RadioGroupItem id={`department-${department.value}`} value={department.value} />
          <Label htmlFor={`department-${department.value}`}>{department.label}</Label>
        </div>
      ))}
    </RadioGroup>
  )
}
