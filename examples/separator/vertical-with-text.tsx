import { Button } from "@booleanpress/ui/button"
import { Separator } from "@booleanpress/ui/separator"

export default function SeparatorVerticalWithText() {
  return (
    <div className="flex h-40 w-full max-w-md items-stretch gap-6">
      <div className="flex flex-1 flex-col justify-center gap-2 text-sm">
        <p className="font-medium">Use an API key</p>
        <p className="text-muted-foreground">For servers and scripts.</p>
        <Button variant="outline" size="sm" className="self-start">Create a key</Button>
      </div>
      <Separator orientation="vertical" className="text-xs text-muted-foreground uppercase">
        or
      </Separator>
      <div className="flex flex-1 flex-col justify-center gap-2 text-sm">
        <p className="font-medium">Use SMTP</p>
        <p className="text-muted-foreground">For apps that send by SMTP.</p>
        <Button variant="outline" size="sm" className="self-start">Show the details</Button>
      </div>
    </div>
  )
}
