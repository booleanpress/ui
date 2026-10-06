import * as React from "react"
import { Button } from "@booleanpress/ui/button"
import { Editor } from "@booleanpress/ui/editor"
import { Label } from "@booleanpress/ui/label"
import { Switch } from "@booleanpress/ui/switch"

export default function EditorWithForm() {
  const [disabled, setDisabled] = React.useState(false)
  const [sent, setSent] = React.useState<string | null>(null)

  return (
    <form
      className="flex w-full max-w-2xl flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault()
        setSent([...new FormData(event.currentTarget)].map(([key, value]) => `${key} = ${value}`).join(", "))
      }}
    >
      <Editor aria-label="Reply" name="reply" defaultValue="<p>Initial text</p>" disabled={disabled} contentClassName="min-h-24" />
      <div className="flex items-center gap-2">
        <Switch id="reply-disabled" checked={disabled} onCheckedChange={setDisabled} />
        <Label htmlFor="reply-disabled">Disable</Label>
      </div>
      <div className="flex gap-2">
        <Button type="submit">Submit</Button>
        <Button type="reset" variant="outline">
          Reset
        </Button>
      </div>
      <pre className="overflow-x-auto rounded-md bg-muted px-3 py-2 font-mono text-xs whitespace-pre-wrap text-foreground">
        {sent === null ? "Press Submit to see what the form sends." : `Sent: ${sent || "(nothing)"}`}
      </pre>
    </form>
  )
}
