import { Editor } from "@booleanpress/ui/editor"

export default function EditorDisabled() {
  return (
    <Editor
      aria-label="Signature"
      disabled
      defaultValue="<p><strong>Sam Ortiz</strong><br>Support, Northwind Mail</p>"
      contentClassName="min-h-24"
      className="max-w-2xl"
    />
  )
}
