import { Button } from "@booleanpress/ui/button"
import { Separator } from "@booleanpress/ui/separator"

export default function SeparatorWithText() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-3.5">
      <Button>Connect with Amazon SES</Button>
      <Separator className="text-xs text-muted-foreground uppercase">or</Separator>
      <Button variant="outline">Enter SMTP details</Button>
    </div>
  )
}
