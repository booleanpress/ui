import { FloatLabel } from "@booleanpress/ui/float-label"
import { Label } from "@booleanpress/ui/label"
import { Textarea } from "@booleanpress/ui/textarea"

export default function FloatLabelTextarea() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-8 pt-4.5">
      <FloatLabel>
        <Textarea id="fl-note" rows={3} />
        <Label htmlFor="fl-note">Internal note</Label>
      </FloatLabel>
      <FloatLabel variant="in">
        <Textarea id="fl-reply" rows={3} defaultValue="Thanks, we have resent the message." />
        <Label htmlFor="fl-reply">Reply</Label>
      </FloatLabel>
    </div>
  )
}
