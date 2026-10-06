import { Input } from "@booleanpress/ui/input"
import { Label } from "@booleanpress/ui/label"

const FIELDS = [
  { id: "kf-int", label: "Integer", filter: "int" },
  { id: "kf-num", label: "Number", filter: "num" },
  { id: "kf-money", label: "Money", filter: "money" },
  { id: "kf-hex", label: "Hex", filter: "hex" },
  { id: "kf-alpha", label: "Alphabetic", filter: "alpha" },
  { id: "kf-alphanum", label: "Alphanumeric", filter: "alphanum" },
] as const

export default function InputKeyFilter() {
  return (
    <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
      {FIELDS.map((field) => (
        <div key={field.id} className="flex flex-col gap-2">
          <Label htmlFor={field.id}>{field.label}</Label>
          <Input id={field.id} keyFilter={field.filter} />
        </div>
      ))}
    </div>
  )
}
