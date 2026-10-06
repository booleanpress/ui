import { Label } from "@booleanpress/ui/label"
import { Textarea } from "@booleanpress/ui/textarea"

export default function TextareaGrows() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Label htmlFor="ticket-reply">Reply</Label>
      <Textarea
        autoResize
        rows={5}
        cols={30}
        fluid
        id="ticket-reply"
        defaultValue={"Hi Sam,\n\nThanks for the details. We have found the failed message.\nThe mailbox was full, so the provider rejected it.\n\nWe will resend it today."}
      />
    </div>
  )
}
