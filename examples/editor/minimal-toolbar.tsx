import { Editor } from "@booleanpress/ui/editor"

export default function EditorMinimalToolbar() {
  return (
    <Editor
      aria-label="Internal note"
      toolbar={[["bold", "italic", "underline"], ["bulletList"], ["link"]]}
      placeholder="Add a note only your team can see"
      contentClassName="min-h-24"
      className="max-w-xl"
    />
  )
}
