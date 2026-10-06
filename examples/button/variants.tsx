import { Button } from "@booleanpress/ui/button"

export default function ButtonVariants() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Save</Button>
      <Button variant="secondary">Duplicate</Button>
      <Button variant="outline">Cancel</Button>
      <Button variant="ghost">Skip</Button>
      <Button variant="destructive">Delete</Button>
      <Button variant="link">Learn more</Button>
    </div>
  )
}
