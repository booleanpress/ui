import { Editor } from "@booleanpress/ui/editor"

const NOTES = `<h3>Release 4.2</h3>
<ul><li><strong>Templates:</strong> open rate per template in the monthly report.</li><li><strong>Logs:</strong> bounces now show the receiving server's reply.</li></ul>
<p>Read the full notes in the <a href="https://example.com/changelog">changelog</a>.</p>`

export default function EditorReadOnly() {
  return <Editor aria-label="Release notes" readOnly defaultValue={NOTES} contentClassName="min-h-0" className="max-w-2xl" />
}
