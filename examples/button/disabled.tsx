import { Button } from "@booleanpress/ui/button"

export default function ButtonDisabled() {
  return (
    <div className="flex flex-col items-start gap-1.5">
      <Button disabled>Publish</Button>
      <p className="text-sm text-muted-foreground">Add a sender address to publish.</p>
    </div>
  )
}
