import { Inplace } from "@booleanpress/ui/inplace"

export default function InplaceTextarea() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-1">
      <span className="ps-2.5 text-xs font-medium text-muted-foreground uppercase">Email footer</span>
      <Inplace
        label="Email footer"
        multiline
        defaultValue="You receive this email because you have an account at example.com."
        className="w-full"
      />
      <p className="ps-2.5 text-xs text-muted-foreground">Ctrl+Enter or ⌘+Enter saves; Enter starts a new line.</p>
    </div>
  )
}
