import * as React from "react"
import { CopyButton } from "@booleanpress/ui/copy-button"

export default function CopyButtonCustomTimeout() {
  const [copies, setCopies] = React.useState(0)

  return (
    <div className="flex flex-col items-start gap-2">
      <CopyButton
        showLabel
        timeout={5000}
        getValue={() => "v=spf1 include:_spf.example.com ~all"}
        onCopy={() => setCopies((count) => count + 1)}
      />
      <p className="text-sm text-muted-foreground">
        The SPF record stays “Copied” for five seconds. Copied {copies} {copies === 1 ? "time" : "times"}.
      </p>
    </div>
  )
}
