import * as React from "react"
import { CopyButton } from "@booleanpress/ui/copy-button"

export default function CopyButtonCopyFails() {
  const [error, setError] = React.useState("")

  return (
    <div className="flex flex-col items-start gap-2">
      <CopyButton
        showLabel
        // The value cannot be read, so nothing reaches the clipboard: the button shows a cross and says "Copy failed".
        getValue={() => Promise.reject(new Error("The backup code could not be read."))}
        onCopyError={(reason) => setError(reason instanceof Error ? reason.message : "Copy failed")}
      />
      <p className="min-h-5 text-sm text-destructive-strong">{error}</p>
    </div>
  )
}
