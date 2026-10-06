import { Textarea } from "@booleanpress/ui/textarea"

export default function TextareaSizes() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Textarea size="sm" aria-label="Small" placeholder="Small" rows={3} />
      <Textarea aria-label="Normal" placeholder="Normal" rows={3} />
      <Textarea size="lg" aria-label="Large" placeholder="Large" rows={3} />
    </div>
  )
}
