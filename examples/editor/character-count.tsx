import { Label } from "@booleanpress/ui/label"
import { Editor } from "@booleanpress/ui/editor"

export default function EditorCharacterCount() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-2">
      <Label id="summary-label">Ticket summary</Label>
      <Editor
        aria-labelledby="summary-label"
        toolbar={[["bold", "italic"], ["link"]]}
        characterCount
        maxLength={200}
        defaultValue="<p>Password reset emails bounce since the sender moved to a domain without DKIM records.</p>"
        contentClassName="min-h-24"
      />
    </div>
  )
}
