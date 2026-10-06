import { Input } from "@booleanpress/ui/input"

export default function InputSizes() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Input size="sm" aria-label="Small" placeholder="Small" />
      <Input aria-label="Normal" placeholder="Normal" />
      <Input size="lg" aria-label="Large" placeholder="Large" />
    </div>
  )
}
