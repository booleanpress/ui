import { Label } from "@booleanpress/ui/label"
import { Textarea } from "@booleanpress/ui/textarea"

export default function TextareaBasic() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Label htmlFor="signature">Email signature</Label>
      <Textarea rows={5} cols={30} id="signature" placeholder="Best regards, the Acme team" />
    </div>
  )
}
