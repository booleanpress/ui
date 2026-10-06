import { Kbd } from "@booleanpress/ui/kbd"

export default function KbdInText() {
  return (
    <p className="max-w-xs text-sm text-muted-foreground">
      Press <Kbd>/</Kbd> to search the email log, or <Kbd>Esc</Kbd> to close the panel.
    </p>
  )
}
