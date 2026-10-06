import { Editor } from "@booleanpress/ui/editor"

export default function EditorFilled() {
  return (
    <Editor
      aria-label="Auto-reply message"
      variant="filled"
      defaultValue="<p>We have your message and reply within one working day.</p>"
      contentClassName="min-h-32"
      className="max-w-2xl"
    />
  )
}
