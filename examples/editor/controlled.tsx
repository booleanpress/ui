import * as React from "react"
import { Editor } from "@booleanpress/ui/editor"

export default function EditorControlled() {
  const [html, setHtml] = React.useState("<p>Thanks for your patience: the <strong>DKIM records</strong> are now live.</p>")

  return (
    <div className="flex w-full max-w-2xl flex-col gap-3">
      <Editor aria-label="Reply to Maya Chen" value={html} onChange={setHtml} contentClassName="min-h-32" />
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-muted-foreground">HTML sent to the server</span>
        <pre className="overflow-x-auto rounded-md bg-muted px-3 py-2 font-mono text-xs whitespace-pre-wrap text-foreground">
          {html || "(empty)"}
        </pre>
      </div>
    </div>
  )
}
