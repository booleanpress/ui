import { Separator } from "@booleanpress/ui/separator"

export default function SeparatorHorizontal() {
  return (
    <div className="w-full max-w-xs">
      <h4 className="text-sm font-medium">Delivery settings</h4>
      <p className="text-sm text-muted-foreground">Choose how failed emails are retried.</p>
      <Separator className="my-3.5" />
      <p className="text-sm">Retry up to 3 times, 10 minutes apart.</p>
    </div>
  )
}
