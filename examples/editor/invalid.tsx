import { Label } from "@booleanpress/ui/label"
import { Editor } from "@booleanpress/ui/editor"

export default function EditorInvalid() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-2">
      <Label id="reply-label">Reply</Label>
      <Editor
        aria-labelledby="reply-label"
        aria-invalid
        aria-describedby="reply-error"
        toolbar={[["bold", "italic", "underline"], ["link"]]}
        contentClassName="min-h-24"
      />
      <p id="reply-error" className="text-xs text-destructive-strong">
        Write a reply before you send it.
      </p>
    </div>
  )
}
